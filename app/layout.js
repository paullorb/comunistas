import "./globals.css";

export const metadata = {
  title: "Pinochet in London — Comunistas",
  description:
    "A visual account of Augusto Pinochet's arrest in London, the extradition hearings, and the limits of the outcome.",
  openGraph: {
    title: "Pinochet in London — Comunistas",
    description:
      "A story about law, memory and the distance between them.",
    type: "article",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
