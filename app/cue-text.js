// A paragraph with its marked phrases wrapped. `cues` lists the phrases in the order they appear in
// the text; `kinds` (optional, same order) adds a class per phrase. In a chapter, a marked phrase is
// paired with the red tag of the same index in the panel (app/scenes.js); in the enemy list it takes
// the colour of the dots it talks about. Text outside the marked phrases goes through QuoteText, so
// a translated quotation keeps its "tr." mark (`tr` carries that mark's labels).
import QuoteText from "./quote-text";

export default function CueText({ text, cues = [], kinds, tr }) {
  const out = [];
  let rest = text;
  cues.forEach((phrase, i) => {
    const at = rest.indexOf(phrase);
    if (at < 0) return;
    if (at > 0) out.push(<QuoteText key={`t${i}`} text={rest.slice(0, at)} tr={tr} />);
    out.push(<span key={i} className={kinds ? `cue cue-${kinds[i]}` : "cue"} data-cue={i}>{phrase}</span>);
    rest = rest.slice(at + phrase.length);
  });
  out.push(<QuoteText key="end" text={rest} tr={tr} />);
  return out;
}
