import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TuftForest GT | Alfombras Artesanales Personalizadas en Guatemala",
  description:
    "Alfombras personalizadas hechas a mano con técnica tufting. Expresá tu estilo con piezas únicas de alta calidad. Enviamos a toda Guatemala.",
  keywords: "alfombras tufting Guatemala, alfombras personalizadas, alfombras artesanales, TuftForest",
  openGraph: {
    title: "TuftForest GT | Alfombras Artesanales Personalizadas",
    description: "Alfombras personalizadas hechas a mano con técnica tufting en Guatemala.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
