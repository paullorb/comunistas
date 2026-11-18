export default function manifest() {
  return {
    name: "Comunistas — El expediente Pinochet",
    short_name: "Comunistas",
    description: "Cómo una dictadura definió a su enemigo y cómo una orden de detención en Londres lo puso a prueba.",
    start_url: "/",
    display: "standalone",
    background_color: "#e9e5db",
    theme_color: "#e9e5db",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
