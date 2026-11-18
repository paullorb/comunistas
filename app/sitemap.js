// Both languages, each pointing at the other as an alternate.
export default function sitemap() {
  const es = "https://comunistas.app";
  const en = "https://comunistas.app/en";
  const languages = { es, en };
  return [
    { url: es, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: en, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}
