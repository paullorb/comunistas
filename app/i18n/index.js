import { chapterVisuals, afterVisuals, stageBase, sourceBase } from "../data";
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
        short: t.short,
        date: t.date,
        title: t.title,
        body: t.body,
        note: t.note,
        cues: (t.cues ?? []).map((phrase, j) => [phrase, base.cues?.[j] ?? "neutral"]),
        named: base.named,
        suspended: base.suspended,
        rings: base.rings,
        mode: base.mode,
        stat: base.statValue ? { value: base.statValue, label: t.statLabel } : undefined,
        legend: base.legend.map((kind, j) => [kind, t.legend?.[j] ?? c.legendText[kind]]),
        source: t.source ? { label: t.source, href: t.sourceHref ?? base.sourceHref } : undefined,
      };
    }),
    sources: sourceBase
      .map((s, idx) => {
        const tagged = s.lang === lang ? c.sources[idx].detail : `${c.sources[idx].detail} (${c.ui.langTag[s.lang]})`;
        return { href: s.href, lang: s.lang, title: c.sources[idx].title, detail: tagged };
      })
      // Sources in the reader's own language first; the sort is stable so the rest keeps its order.
      .sort((a, b) => Number(b.lang === lang) - Number(a.lang === lang)),
  };
}
