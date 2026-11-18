import "./globals.css";
import "./motion.css";

export const metadata = {
  title: "The Pinochet File — Comunistas",
  description:
    "How a dictatorship defined its enemy, how a warrant in London tested it, and the limits of the outcome — an interactive, source-led account.",
  openGraph: {
    title: "The Pinochet File — Comunistas",
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
