import { chapterVisuals, afterVisuals, stageBase, sourceHrefs } from "../data";
import es from "./es";
import en from "./en";

export const defaultLocale = "es";
export const locales = ["es", "en"];

const copy = { es, en };

export const hasLocale = (value) => Object.hasOwn(copy, value);

// Path of the page in a given language: Spanish is the default and lives at the clean root.
export const localePath = (lang) => (lang === defaultLocale ? "/" : `/${lang}`);

// Merge the shared structure with one language's copy.
export function getContent(lang) {
  const c = copy[lang];
  return {
    locale: c.locale,
    ui: c.ui,
    chapters: chapterVisuals.map((visual, i) => ({ visual, ...c.chapters[i] })),
    afterChapters: afterVisuals.map((visual, i) => ({ visual, ...c.afterChapters[i] })),
    stages: stageBase.map((base, i) => {
      const t = c.stages[i];
      return {
        key: base.key,
        date: t.date,
        title: t.title,
        body: t.body,
        note: t.note,
        named: base.named,
        suspended: base.suspended,
        rings: base.rings,
        mode: base.mode,
        stat: base.statValue ? { value: base.statValue, label: t.statLabel } : undefined,
        legend: base.legend.map((kind, j) => [kind, t.legend?.[j] ?? c.legendText[kind]]),
        source: base.sourceHref ? { label: t.source, href: base.sourceHref } : undefined,
      };
    }),
    sources: sourceHrefs.map((href, i) => ({ href, ...c.sources[i] })),
  };
}
