import { notFound } from "next/navigation";
import "../globals.css";
import "../motion.css";
import { getContent, hasLocale, locales, localePath } from "../i18n";

// Only the declared languages exist; anything else under /[lang] is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { ui } = getContent(lang);
  return {
    metadataBase: new URL("https://comunistas.app"),
    title: ui.title,
    description: ui.description,
    alternates: {
      canonical: localePath(lang),
      languages: { es: localePath("es"), en: localePath("en"), "x-default": localePath("es") },
    },
    openGraph: {
      title: ui.title,
      description: ui.ogDescription,
      type: "article",
      locale: lang === "es" ? "es_CL" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_CL"],
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
