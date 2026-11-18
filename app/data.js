// Language-independent story structure. All visible text lives in app/i18n/<lang>.js and is
// merged with this by getContent() in app/i18n/index.js, so the two languages cannot drift apart
// on facts, counts or links. Arrays here and in the dictionaries line up index-for-index.

export const chapterVisuals = ["coup", "arrival", "arrest", "court", "ruling", "commit", "end"];
export const afterVisuals = ["return", "immunity", "verdict"];

// The enemy definer. `named` / `suspended` are counts of dots (of 360) in each state; the field
// is illustrative and not to scale until the last step, where each dot ≈ 111 people.
export const stageBase = [
  { key: "before", named: 0, suspended: 0, legend: ["neutral"] },
  { key: "coup", named: 36, suspended: 0, legend: ["neutral", "named"] },
  {
    key: "dl77", named: 86, suspended: 0, statValue: 7, legend: ["neutral", "named"],
    sourceHref: "https://hrlibrary.umn.edu/iachr/country-reports/chile1974-ch12.html",
  },
  {
    key: "dl78", named: 86, suspended: 144, legend: ["neutral", "named", "suspended"],
    sourceHref: "https://hrlibrary.umn.edu/iachr/country-reports/chile1974-ch12.html",
  },
  {
    key: "prats", named: 86, suspended: 144, rings: [69], legend: ["neutral", "named", "suspended", "ring"],
    sourceHref: "https://en.wikipedia.org/wiki/Carlos_Prats",
  },
  {
    key: "letelier", named: 86, suspended: 144, rings: [69, 267, 292], legend: ["neutral", "named", "suspended", "ring"],
    sourceHref: "https://nsarchive.gwu.edu/briefing-book/chile/2024-06-18/pinochet-regime-declassified-dina-gestapo-type-police-force-chile",
  },
  {
    key: "dl1697", named: 86, suspended: 230, legend: ["neutral", "named", "suspended"],
    sourceHref: "https://www.vicariadelasolidaridad.cl/node/7579",
  },
  {
    key: "count", named: 0, suspended: 0, mode: "count", statValue: 40018, legend: ["counted", "killed"],
    sourceHref: "https://en.mercopress.com/2011/08/19/pinochet-s-regime-official-victims-list-increased-by-9.800-to-40.018",
  },
];

export const sourceHrefs = [
  "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm",
  "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm",
  "https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet",
  "https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet",
  "https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf",
  "https://hrlibrary.umn.edu/iachr/country-reports/chile1974-ch12.html",
  "https://www.vicariadelasolidaridad.cl/node/7579",
  "https://nsarchive.gwu.edu/briefing-book/chile/2024-06-18/pinochet-regime-declassified-dina-gestapo-type-police-force-chile",
  "https://en.mercopress.com/2011/08/19/pinochet-s-regime-official-victims-list-increased-by-9.800-to-40.018",
  "https://www.hrw.org/wr2k1/americas/chile.html",
  "https://www.ipsnews.net/?p=22056",
  "https://theconversation.com/general-pinochet-arrest-20-years-on-heres-how-it-changed-global-justice-104806",
];
