import { notFound } from "next/navigation";
import "../globals.css";
import "../motion.css";
import "../ending.css";
import "../polish.css";
import { getContent, hasLocale, locales, localePath } from "../i18n";

export const viewport = { themeColor: "#e9e5db" };

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
      siteName: "Comunistas",
      url: localePath(lang),
      locale: lang === "es" ? "es_CL" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_CL"],
      images: [{ url: `/og/og-${lang}.png`, width: 1200, height: 630, alt: ui.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ui.title,
      description: ui.description,
      images: [`/og/og-${lang}.png`],
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
