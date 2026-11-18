import "./globals.css";
import "./motion.css";

export const metadata = {
  title: "404 — Comunistas",
  description: "Esta página no figura en el expediente. This page is not in the file.",
  robots: { index: false },
};

// Bilingual on purpose: this page renders for URLs outside /es and /en, so the language is unknown.
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body className="nf-body">
        <main className="nf" id="main">
          <a className="wordmark" href="/"><span className="mark">C.</span> comunistas</a>
          <p className="eyebrow">404</p>
          <h1>
            <span className="nf-line">Esta página no figura</span>
            <span className="nf-line"><em>en el expediente.</em></span>
          </h1>
          <p className="nf-en">This page is not in the file.</p>
          <div className="nf-links">
            <a href="/">Volver al expediente <span aria-hidden="true">→</span></a>
            <a href="/en" lang="en">Read it in English <span aria-hidden="true">→</span></a>
          </div>
          <div className="nf-line-art" aria-hidden="true" />
        </main>
      </body>
    </html>
  );
}
