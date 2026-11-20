// A paragraph with its marked phrases wrapped. `cues` lists the phrases in the order they appear in
// the text; `kinds` (optional, same order) adds a class per phrase. In a chapter, a marked phrase is
// paired with the red tag of the same index in the panel (app/scenes.js); in the enemy list it takes
// the colour of the dots it talks about.
export default function CueText({ text, cues = [], kinds }) {
  const out = [];
  let rest = text;
  cues.forEach((phrase, i) => {
    const at = rest.indexOf(phrase);
    if (at < 0) return;
    if (at > 0) out.push(rest.slice(0, at));
    out.push(<span key={i} className={kinds ? `cue cue-${kinds[i]}` : "cue"} data-cue={i}>{phrase}</span>);
    rest = rest.slice(at + phrase.length);
  });
  out.push(rest);
  return out;
}
