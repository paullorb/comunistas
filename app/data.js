// Language-independent story structure. All visible text lives in app/i18n/<lang>.js and is
// merged with this by getContent() in app/i18n/index.js, so the two languages cannot drift apart
// on facts, counts or links. Arrays here and in the dictionaries line up index-for-index.

export const chapterVisuals = ["coup", "arrival", "arrest", "court", "ruling", "commit", "end"];
export const afterVisuals = ["return", "immunity", "verdict"];

// Where each panel pins its red tags, in the order of the chapter's `cues` (app/i18n): the top-left
// corner of the chip (or its right edge when the row ends with "end") and the point it marks, in the
// panel's 400×300 space.
export const sceneTags = {
  coup: [[16, 170, 74, 200], [216, 184, 200, 216], [296, 118, 326, 146]],
  arrival: [[392, 104, 306, 72, "end"], [14, 150, 56, 176], [392, 142, 340, 170, "end"]],
  arrest: [[150, 48, 135, 77], [220, 122, 232, 146, "end"], [100, 156, 88, 172]],
  court: [[40, 100, 152, 128], [258, 118, 267, 144], [392, 54, 182, 68, "end"]],
  ruling: [[8, 224, 92, 246], [286, 120, 268, 144], [286, 190, 268, 202]],
  commit: [[212, 96, 200, 152], [394, 156, 364, 178, "end"]],
  end: [[10, 180, 48, 208], [180, 172, 163, 180], [282, 206, 345, 191]],
  return: [[392, 112, 304, 142, "end"], [40, 172, 96, 206], [174, 116, 206, 150]],
  immunity: [[150, 180, 192, 208], [300, 56, 279, 72]],
  verdict: [[392, 92, 276, 120, "end"], [392, 196, 273, 231, "end"]],
};

// The victim counts, from the commissions' own reports (see the sources list):
//   killed or disappeared  3,197 (Rettig 1991 + CNRR 1996) + 30 (Valech II, 2011)            = 3,227
//   prison and torture     27,255 (Valech I, 2004) + 1,204 (2005) + 9,795 (Valech II, 2011)  = 38,254
// The sum of the two, 41,481, is this site's own addition: no official document prints it
// (Valech II says "más de 40 mil"). The 40,018 that circulates in the press is an AP sum whose
// addends match no official figure, so it is not used.
export const VICTIMS = { killed: 3227, survivors: 38254, total: 41481 };

// BCN shows a norm as currently in force unless a version is given; pass the publication date to
// pin the text the story quotes (the original Article 8, the original list of parties in DL 77).
const leyChile = (id, version) => `https://www.bcn.cl/leychile/navegar?idNorma=${id}${version ? `&idVersion=${version}` : ""}`;
const VALECH_II = "https://bibliotecadigital.indh.cl/handle/123456789/600";

// The enemy definer. `named` / `suspended` are counts of dots (of 360) in each state; the field
// is illustrative until the last step; the canvas holds one dot per recognised victim.
// `cues` gives the dot state each marked phrase of the step's copy stands for (same order as the
// step's `cues` in app/i18n). `sourceHref` is the default link; a language can override it with `sourceHref` in its copy.
export const stageBase = [
  { key: "before", cues: ["neutral"], named: 0, suspended: 0, legend: ["neutral"] },
  { key: "coup", cues: ["named"], named: 36, suspended: 0, legend: ["neutral", "named"], sourceHref: leyChile(237897) },
  { key: "dl77", cues: ["named"], named: 86, suspended: 0, legend: ["neutral", "named"], sourceHref: leyChile(5730, "1973-10-13") },
  { key: "dl78", cues: ["suspended"], named: 86, suspended: 144, legend: ["neutral", "named", "suspended"], sourceHref: leyChile(5731) },
  {
    key: "prats", cues: ["ring"], named: 86, suspended: 144, rings: [69], legend: ["neutral", "named", "suspended", "ring"],
    sourceHref: "https://interactivos.museodelamemoria.cl/justicia/archivo/CS_2596-2009_Reemplazo.pdf",
  },
  {
    key: "letelier", cues: ["ring", "ring"], named: 86, suspended: 144, rings: [69, 267, 292], legend: ["neutral", "named", "suspended", "ring"],
    sourceHref: "https://nsarchive.gwu.edu/sites/default/files/documents/3212949/Document-03-DOS-Pinochet-and-the-Letelier.pdf",
  },
  { key: "dl1697", cues: ["suspended"], named: 86, suspended: 230, legend: ["neutral", "named", "suspended"], sourceHref: leyChile(6723) },
  { key: "dl2191", named: 86, suspended: 230, legend: ["neutral", "named", "suspended"], sourceHref: leyChile(6849) },
  { key: "art8", cues: ["named"], named: 86, suspended: 230, legend: ["neutral", "named", "suspended"], sourceHref: leyChile(7129, "1980-08-11") },
  {
    key: "count", cues: ["killed", "counted"], named: 0, suspended: 0, mode: "count", statValue: VICTIMS.total, legend: ["counted", "killed"],
    sourceHref: VALECH_II,
  },
];

// Source list. `lang` is the language of the source itself; the Spanish page lists Spanish sources
// first and tags the rest "(en inglés)", the English page tags the Spanish ones "(in Spanish)".
// Dictionaries carry { title, detail } in the same order.
export const sourceBase = [
  // United Kingdom: courts and Parliament
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm" },
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet" },
  { lang: "en", href: "https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/written_answers/1998/dec/09/senator-pinochet" },
  { lang: "en", href: "https://api.parliament.uk/historic-hansard/written_answers/1999/apr/15/senator-pinochet" },
  // Spain: the investigating judge, the Audiencia Nacional and the government
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/juicio/captura.html" },
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/juicio/funda.html" },
  { lang: "es", href: "http://www.derechos.net/doc/auto31198/" },
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/juicio/audi.html" },
  { lang: "es", href: "https://www.lamoncloa.gob.es/consejodeministros/referencias/paginas/1998/c0611980.aspx" },
  // Chile: decrees, the 1980 Constitution and the Constitutional Tribunal
  { lang: "es", href: leyChile(237897) },
  { lang: "es", href: leyChile(5730, "1973-10-13") },
  { lang: "es", href: leyChile(5731) },
  { lang: "es", href: leyChile(6158) },
  { lang: "es", href: leyChile(6723) },
  { lang: "es", href: leyChile(6849) },
  { lang: "es", href: leyChile(7129, "1980-08-11") },
  { lang: "es", href: leyChile(30201) },
  { lang: "es", href: "https://buscador-backend.tcchile.cl/api/extended/21/download" },
  { lang: "en", href: "https://hrlibrary.umn.edu/iachr/country-reports/chile1974-ch12.html" },
  // Chile: the truth commissions and the count
  { lang: "es", href: "https://bibliotecadigital.indh.cl/handle/123456789/170" },
  { lang: "es", href: "https://web.archive.org/web/20220610200525/https://pdh.minjusticia.gob.cl/wp-content/uploads/2015/12/Informe_CNRR.pdf" },
  { lang: "es", href: "https://bibliotecadigital.indh.cl/handle/123456789/455" },
  { lang: "es", href: VALECH_II },
  { lang: "es", href: "https://obtienearchivo.bcn.cl/obtienearchivo?id=repositorio/10221/22364/1/FINAL+-+El+secreto+de+los+antecedentes+de+la+Comisi%C3%B3n+Valech.pdf" },
  { lang: "es", href: leyChile(1197778) },
  { lang: "en", href: "https://en.mercopress.com/2011/08/19/pinochet-s-regime-official-victims-list-increased-by-9.800-to-40.018" },
  // Prats, Letelier and Operation Condor
  { lang: "es", href: "https://interactivos.museodelamemoria.cl/justicia/archivo/CS_2596-2009_Reemplazo.pdf" },
  { lang: "es", href: "https://www.cancilleria.gob.ar/userfiles/ut/fallo_arancibia_clavel_2004_01.pdf" },
  { lang: "es", href: "https://www.memoriachilena.gob.cl/602/w3-article-79520.html" },
  { lang: "en", href: "https://static.case.law/f2d/636/html/0621-01.html" },
  { lang: "en", href: "https://static.case.law/f-supp/502/html/0259-01.html" },
  { lang: "en", href: "https://legal.un.org/riaa/cases/vol_XXV/1-19.pdf" },
  { lang: "en", href: "https://nsarchive.gwu.edu/sites/default/files/documents/3212949/Document-03-DOS-Pinochet-and-the-Letelier.pdf" },
  { lang: "en", href: "https://nsarchive.gwu.edu/document/18421-national-security-archive-doc-05-fbi-cable" },
  { lang: "en", href: "https://history.state.gov/historicaldocuments/frus1969-76ve11p2/d241" },
  { lang: "en", href: "https://nsarchive.gwu.edu/briefing-book/chile/2024-06-18/pinochet-regime-declassified-dina-gestapo-type-police-force-chile" },
  // Chile after London
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/juicio/desafuero2.html" },
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/juicio/reo.html" },
  { lang: "es", href: "https://www.hrw.org/legacy/spanish/press/2002/chile_pinochet.html" },
  { lang: "en", href: "https://www.amnesty.org/en/wp-content/uploads/2021/06/amr220062002en.pdf" },
  { lang: "es", href: "https://www.derechos.org/nizkor/chile/doc/krassnoff.html" },
  { lang: "en", href: "https://www.govinfo.gov/content/pkg/CPRT-109SPRT20278/html/CPRT-109SPRT20278.htm" },
  { lang: "en", href: "https://www.govinfo.gov/content/pkg/CHRG-108shrg95501/html/CHRG-108shrg95501.htm" },
  { lang: "es", href: "https://www.memoriachilena.gob.cl/602/w3-article-92410.html" },
  { lang: "es", href: "https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Augusto_Pinochet_Ugarte" },
  // Press and secondary sources, used only where no official record was found
  { lang: "es", href: "https://cooperativa.cl/noticias/pais/augusto-pinochet/a-10-anos-de-la-detencion-de-pinochet-en-lond/2008-10-15/165904.html" },
  { lang: "es", href: "https://www.amnesty.org/es/latest/news/2013/10/how-general-pinochets-detention-changed-meaning-justice/" },
  { lang: "en", href: "https://www.upi.com/Archives/1998/12/02/Pinochet-moved-to-new-location/4047912574800/" },
  { lang: "en", href: "https://theconversation.com/general-pinochet-arrest-20-years-on-heres-how-it-changed-global-justice-104806" },
  { lang: "es", href: "https://www.ultimahora.es/noticias/internacional/2000/03/04/923871/pinochet-llego-a-chile-en-plena-forma-y-con-honores-militares.html" },
  { lang: "es", href: "https://www.pagina12.com.ar/2000/00-03/00-03-04/pag03.htm" },
  { lang: "en", href: "https://www.ipsnews.net/?p=22056" },
];
