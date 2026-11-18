// Language-independent story structure. All visible text lives in app/i18n/<lang>.js and is
// merged with this by getContent() in app/i18n/index.js, so the two languages cannot drift apart
// on facts, counts or links. Arrays here and in the dictionaries line up index-for-index.

export const chapterVisuals = ["coup", "arrival", "arrest", "court", "ruling", "commit", "end"];
export const afterVisuals = ["return", "immunity", "verdict"];

// The enemy definer. `named` / `suspended` are counts of dots (of 360) in each state; the field
// is illustrative and not to scale until the last step, where each dot ≈ 111 people.
// `sourceHref` is the default link; a language can override it with `sourceHref` in its copy
// (e.g. the Spanish page links Spanish-language sources where they exist).
export const stageBase = [
  { key: "before", named: 0, suspended: 0, legend: ["neutral"] },
  { key: "coup", named: 36, suspended: 0, legend: ["neutral", "named"] },
  { key: "dl77", named: 86, suspended: 0, legend: ["neutral", "named"], sourceHref: "https://www.bcn.cl/leychile/navegar?idNorma=5730" },
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

// Source list. `lang` is the language of the source itself; the Spanish page lists Spanish sources
// first and tags the rest "(en inglés)", the English page tags the Spanish ones "(in Spanish)".
// Dictionaries carry { title, detail } in the same order.
export const sourceBase = [
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm" },
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet" },
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf" },
  { lang: "es", href: "https://www.bcn.cl/leychile/navegar?idNorma=5730" },
  { lang: "en", href: "https://hrlibrary.umn.edu/iachr/country-reports/chile1974-ch12.html" },
  { lang: "es", href: "https://www.vicariadelasolidaridad.cl/node/7579" },
  { lang: "en", href: "https://nsarchive.gwu.edu/briefing-book/chile/2024-06-18/pinochet-regime-declassified-dina-gestapo-type-police-force-chile" },
  { lang: "es", href: "https://es.wikipedia.org/wiki/Carlos_Prats" },
  { lang: "es", href: "https://es.wikipedia.org/wiki/Orlando_Letelier" },
  { lang: "es", href: "https://es.wikipedia.org/wiki/Informe_Valech" },
  { lang: "en", href: "https://en.mercopress.com/2011/08/19/pinochet-s-regime-official-victims-list-increased-by-9.800-to-40.018" },
  { lang: "es", href: "https://es.wikipedia.org/wiki/Arresto_de_Augusto_Pinochet_en_Londres" },
  { lang: "es", href: "https://cooperativa.cl/noticias/pais/augusto-pinochet/a-10-anos-de-la-detencion-de-pinochet-en-lond/2008-10-15/165904.html" },
  { lang: "es", href: "https://www.amnesty.org/es/latest/news/2013/10/how-general-pinochets-detention-changed-meaning-justice/" },
  { lang: "en", href: "https://www.upi.com/Archives/1998/12/02/Pinochet-moved-to-new-location/4047912574800/" },
  { lang: "en", href: "https://theconversation.com/general-pinochet-arrest-20-years-on-heres-how-it-changed-global-justice-104806" },
  { lang: "es", href: "https://www.ultimahora.es/noticias/internacional/2000/03/04/923871/pinochet-llego-a-chile-en-plena-forma-y-con-honores-militares.html" },
  { lang: "es", href: "https://www.pagina12.com.ar/2000/00-03/00-03-04/pag03.htm" },
  { lang: "es", href: "https://www.ultimahora.es/noticias/internacional/2000/08/08/898837/pinochet-pierde-la-inmunidad.html" },
  { lang: "en", href: "https://www.hrw.org/wr2k1/americas/chile.html" },
  { lang: "es", href: "https://cooperativa.cl/noticias/pais/pinochet-fue-senador-vitalicio-por-cuatro-anos-y-tres-meses/2002-07-04/142000.html" },
  { lang: "en", href: "https://www.ipsnews.net/?p=22056" },
];
