// Checks that every link in the source list still answers. Run with `npm run check:links`.
//
// Not part of the pull-request checks: it depends on two dozen outside servers, some of which
// refuse automated requests. A scheduled workflow runs it weekly instead. A link counts as dead
// only on a definite answer (404, 410, DNS failure); 401/403/429 and timeouts are reported as
// "could not verify" and do not fail the run.
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/data.js", import.meta.url), "utf8");
const leyChile = (id, version) => `https://www.bcn.cl/leychile/navegar?idNorma=${id}${version ? `&idVersion=${version}` : ""}`;
const links = new Set();
for (const m of source.matchAll(/"(https?:\/\/[^"\s]+)"/g)) links.add(m[1]);
for (const m of source.matchAll(/leyChile\((\d+)(?:,\s*"([\d-]+)")?\)/g)) links.add(leyChile(m[1], m[2]));

const UA = "comunistas-link-check (+https://comunistas.app)";
async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
      if (res.ok) return { status: "ok", code: res.status };
      if (method === "HEAD") continue; // many servers reject HEAD; retry with GET
      if ([404, 410].includes(res.status)) return { status: "dead", code: res.status };
      return { status: "unverified", code: res.status };
    } catch (error) {
      if (method === "HEAD") continue;
      const code = error.cause?.code ?? error.name;
      return { status: code === "ENOTFOUND" ? "dead" : "unverified", code };
    }
  }
}

const results = [];
const queue = [...links];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      results.push({ url, ...(await probe(url)) });
    }
  }),
);

const by = (status) => results.filter((r) => r.status === status);
for (const r of by("unverified")) console.log(`could not verify (${r.code}): ${r.url}`);
for (const r of by("dead")) console.error(`DEAD (${r.code}): ${r.url}`);
console.log(`${by("ok").length} ok, ${by("unverified").length} could not be verified, ${by("dead").length} dead, of ${results.length} links.`);
if (by("dead").length) process.exit(1);
