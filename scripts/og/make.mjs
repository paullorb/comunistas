// Regenerates the share images and the Apple touch icon from scripts/og/template.html.
// Usage: node scripts/og/make.mjs   (needs `playwright` resolvable from the repo, e.g. npx playwright install chromium)
import { chromium } from "playwright";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const template = pathToFileURL(join(here, "template.html")).href;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

for (const lang of ["es", "en"]) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`${template}?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, "public", "og", `og-${lang}.png`) });
  await page.close();
}

// The icons are app/icon.svg (the same drawing as app/logo-mark.js) rendered at each size.
const mark = await readFile(join(root, "app", "icon.svg"), "utf8");
const icon = await browser.newPage({ viewport: { width: 180, height: 180 } });
await icon.setContent(`<body style="margin:0">${mark.replace("<svg ", '<svg width="180" height="180" ')}</body>`);
await icon.screenshot({ path: join(root, "app", "apple-icon.png") });
await icon.setViewportSize({ width: 48, height: 48 });
// A 1px clear border keeps the PNG in RGBA, which the ICO decoder requires (a fully opaque shot comes out RGB).
await icon.setContent(`<body style="margin:0;padding:1px">${mark.replace("<svg ", '<svg width="46" height="46" style="display:block" ')}</body>`);
// favicon.ico: screenshot to a scratch png, then wrap it in an ICO container.
const favPng = await icon.screenshot({ omitBackground: true });
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 48; header[7] = 48; header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(favPng.length, 14); header.writeUInt32LE(22, 18);
await writeFile(join(root, "app", "favicon.ico"), Buffer.concat([header, favPng]));
await browser.close();
