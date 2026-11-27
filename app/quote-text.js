import { useId } from "react";

// Quotations follow the language of the page. When the source is in the reader's language, the copy
// quotes it word for word and there is nothing to mark. When it is not, the copy gives our
// translation and follows the closing quote mark with a token holding the source's language and its
// own words:
//
//   “the Supreme Command of the Nation”[[es: el Mando Supremo de la Nación]]
//
// This renders the token as a small "tr." mark that opens the original wording, so a translated
// quotation is never presented as the source's own words. `npm run check` verifies that each
// original also appears, as a quotation, in the copy of that language.
export const TRANSLATION_TOKEN = /\[\[([a-z]{2}): ([^\]]+)\]\]/g;

const QUOTE_MARKS = { es: ["«", "»"], en: ["“", "”"] };

// The text with every token removed: for places that cannot hold markup (meta tags, aria labels).
export const plainText = (text) => text.replace(TRANSLATION_TOKEN, "");

export default function QuoteText({ text, tr }) {
  const id = useId();
  if (!text || !text.includes("[[")) return text;
  const out = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(TRANSLATION_TOKEN)) {
    const [whole, lang, original] = match;
    if (match.index > last) out.push(text.slice(last, match.index));
    const popId = `${id}tr${n}`;
    const [open, close] = QUOTE_MARKS[lang] ?? ["“", "”"];
    out.push(
      <span key={popId} className="tr">
        <button type="button" className="tr-mark" popoverTarget={popId} aria-label={tr?.note}>
          {tr?.mark ?? "tr."}
        </button>
        <span popover="auto" id={popId} className="tr-pop">
          <small>{tr?.note}</small>
          <span lang={lang}>{`${open}${original}${close}`}</span>
        </span>
      </span>,
    );
    last = match.index + whole.length;
    n += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
