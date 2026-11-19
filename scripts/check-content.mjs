// Content guardrails. Run with `npm run check`; CI runs it on every pull request.
//
// The site's promise is that the two languages tell the same story and that every claim can be
// followed to a source. These checks fail the build when an edit breaks that promise in a way a
// machine can see: a missing translation, a source list out of step, a link with no entry in the
// source list, a banned kind of source, or figures that no longer add up.
import { registerHooks } from "node:module";

// The app's files import each other without extensions (the Next.js convention); teach Node that.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.js`, context);
      throw error;
    }
  },
});

const { chapterVisuals, afterVisuals, stageBase, sourceBase, VICTIMS } = await import("../app/data.js");
const { locales, getContent } = await import("../app/i18n/index.js");
const copy = Object.fromEntries(await Promise.all(locales.map(async (l) => [l, (await import(`../app/i18n/${l}.js`)).default])));

const problems = [];
const fail = (message) => problems.push(message);

// Sources that are never acceptable as a citation, and the one host still served over plain http.
const BANNED_HOSTS = [/(^|\.)wikipedia\.org$/, /(^|\.)wikiwand\.com$/, /(^|\.)fandom\.com$/];
const HTTP_ALLOWED = new Set(["www.derechos.net"]);

// 1. Both languages have exactly the same shape: same keys, same array lengths, no empty text.
function sameShape(a, b, path) {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return fail(`${path}: one language has a list, the other does not`);
    if (a.length !== b.length) return fail(`${path}: ${a.length} items in ${locales[0]}, ${b.length} in the other language`);
    return a.forEach((item, i) => sameShape(item, b[i], `${path}[${i}]`));
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return fail(`${path}: missing in one language`);
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(key in a) || !(key in b)) fail(`${path}.${key}: present in only one language`);
      else sameShape(a[key], b[key], `${path}.${key}`);
    }
    return;
  }
  if (typeof a !== typeof b) return fail(`${path}: different types across languages`);
  if (typeof a === "string" && (!a.trim() || !b.trim())) fail(`${path}: empty text`);
}
const [first, ...rest] = locales;
for (const other of rest) sameShape(copy[first], copy[other], other);

// 2. Each language lines up index-for-index with the shared structure in app/data.js.
for (const lang of locales) {
  const c = copy[lang];
  const expect = (name, actual, wanted) => actual === wanted || fail(`${lang}.${name}: ${actual} entries, app/data.js expects ${wanted}`);
  expect("chapters", c.chapters.length, chapterVisuals.length);
  expect("afterChapters", c.afterChapters.length, afterVisuals.length);
  expect("stages", c.stages.length, stageBase.length);
  expect("sources", c.sources.length, sourceBase.length);
  c.stages.forEach((stage, i) => {
    const base = stageBase[i];
    if (!base) return;
    const href = stage.sourceHref ?? base.sourceHref;
    if (stage.source && !href) fail(`${lang}.stages[${i}] (${base.key}): has a source label but no link`);
    if (!stage.source && i > 0) fail(`${lang}.stages[${i}] (${base.key}): every step after the first must cite a source`);
    if (stage.legend && stage.legend.length !== base.legend.length) fail(`${lang}.stages[${i}] (${base.key}): legend length differs from app/data.js`);
  });
}

// 3. The source list: valid, unique, https, and nothing from a banned host.
const listed = new Set();
sourceBase.forEach((source, i) => {
  let url;
  try {
    url = new URL(source.href);
  } catch {
    return fail(`sourceBase[${i}]: not a valid URL (${source.href})`);
  }
  if (!locales.includes(source.lang)) fail(`sourceBase[${i}]: lang "${source.lang}" is not one of ${locales.join(", ")}`);
  if (listed.has(source.href)) fail(`sourceBase[${i}]: duplicate link ${source.href}`);
  listed.add(source.href);
  if (url.protocol !== "https:" && !HTTP_ALLOWED.has(url.hostname)) fail(`sourceBase[${i}]: use https (${source.href})`);
  if (BANNED_HOSTS.some((re) => re.test(url.hostname))) fail(`sourceBase[${i}]: ${url.hostname} is not an acceptable source; cite the primary document`);
});

// 4. Every link a step points to is also in the source list, so the list is the whole record.
for (const lang of locales) {
  for (const stage of getContent(lang).stages) {
    if (stage.source && !listed.has(stage.source.href)) fail(`${lang} step "${stage.key}": its link is missing from sourceBase (${stage.source.href})`);
  }
}

// 5. The victim figures add up and each language prints them in its own number format.
if (VICTIMS.killed + VICTIMS.survivors !== VICTIMS.total) fail(`VICTIMS: ${VICTIMS.killed} + ${VICTIMS.survivors} is not ${VICTIMS.total}`);
const countStage = stageBase.find((s) => s.mode === "count");
if (countStage?.statValue !== VICTIMS.total) fail("The count step's statValue must be VICTIMS.total");
for (const lang of locales) {
  const text = JSON.stringify(copy[lang]);
  for (const [name, value] of Object.entries(VICTIMS)) {
    const printed = value.toLocaleString(copy[lang].locale);
    if (!text.includes(printed)) fail(`${lang}: the ${name} figure ${printed} does not appear in the copy; a number was changed in one place only`);
  }
}

if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Content check passed: ${locales.length} languages, ${stageBase.length} steps, ${chapterVisuals.length + afterVisuals.length} chapters, ${sourceBase.length} sources.`);
