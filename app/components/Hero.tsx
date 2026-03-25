"use client";

import { useMemo } from "react";
import Image from "next/image";

const ALL_IMAGES = [
  "IMG_6534.jpg","IMG_6535.jpg","IMG_6536.jpg","IMG_6793.jpg","IMG_6805.jpg",
  "IMG_6892.jpg","IMG_6923.jpg","IMG_6927.jpg","IMG_6929.jpg","IMG_7045.jpg",
  "IMG_7048.jpg","IMG_7068.jpg","IMG_7158.jpg","IMG_7169.jpg","IMG_7173.jpg",
  "IMG_7268.jpg","IMG_7365.jpg","IMG_7410.jpg","IMG_7411.jpg","IMG_7469.jpg",
  "IMG_7483.jpg","IMG_7484.jpg","IMG_7566.jpg","IMG_7567.jpg","IMG_7572.jpg",
  "IMG_7573.jpg","IMG_7574.jpg","IMG_7598.jpg","IMG_7599.jpg","IMG_7600.jpg",
  "IMG_7603.jpg","IMG_7604.jpg","IMG_7605.jpg","IMG_7606.jpg","IMG_7609.jpg",
  "IMG_7616.jpg","IMG_7617.jpg","IMG_7618.jpg","IMG_7621.jpg","IMG_7632.jpg",
  "IMG_7633.jpg","IMG_7634.jpg","IMG_7635.jpg","IMG_7642.jpg","IMG_7643.jpg",
  "IMG_7676.jpg","IMG_7678.jpg","IMG_7679.jpg","IMG_7683.jpg","IMG_7684.jpg",
  "IMG_7686.jpg","IMG_7687.jpg","IMG_7690.jpg","IMG_7691.jpg","IMG_7692.jpg",
  "IMG_7695.jpg","IMG_7696.jpg","IMG_7697.jpg","IMG_7698.jpg","IMG_7707.jpg",
  "IMG_7708.jpg","IMG_7713.jpg","IMG_7716.jpg","IMG_7717.jpg","IMG_7718.jpg",
  "IMG_7720.jpg","IMG_7721.jpg","IMG_7722.jpg","IMG_7723.jpg","IMG_7743.jpg",
  "IMG_7744.jpg","IMG_7747.jpg","IMG_7748.jpg","IMG_7750.jpg","IMG_7751.jpg",
  "IMG_7761.jpg","IMG_7762.jpg","IMG_7763.jpg","IMG_7764.jpg","IMG_7765.jpg",
  "IMG_7766.jpg","IMG_7768.jpg","IMG_7782.jpg","IMG_7783.jpg","IMG_7784.jpg",
  "IMG_7786.jpg","IMG_7788.jpg","IMG_7789.jpg","IMG_7791.jpg","IMG_7792.jpg",
  "IMG_7793.jpg","IMG_7796.jpg","IMG_7797.jpg","IMG_7798.jpg","IMG_7806.jpg",
  "IMG_7807.jpg","IMG_7860.jpg","IMG_7862.jpg","IMG_7866.jpg","IMG_7867.jpg",
  "IMG_7871.jpg","IMG_7874.jpg","IMG_7875.jpg","IMG_7880.jpg","IMG_7881.jpg",
  "IMG_7990.jpg","IMG_7991.jpg","IMG_7993.jpg","IMG_7994.jpg","IMG_7995.jpg",
  "IMG_8001.jpg","IMG_8002.jpg","IMG_8018.jpg","IMG_8019.jpg","IMG_8023.jpg",
  "IMG_8024.jpg","IMG_8028.jpg","IMG_8029.jpg","IMG_8030.jpg","IMG_8031.jpg",
  "IMG_8033.jpg","IMG_8034.jpg","IMG_8035.jpg","IMG_8036.jpg","IMG_8037.jpg",
  "IMG_8061.jpg","IMG_8063.jpg","IMG_8065.jpg","IMG_8066.jpg","IMG_8206.jpg",
  "IMG_8207.jpg","IMG_8208.jpg","IMG_8209.jpg","IMG_8210.jpg","IMG_8211.jpg",
  "IMG_8214.jpg","IMG_8218.jpg","IMG_8219.jpg","IMG_8220.jpg","IMG_8221.jpg",
  "IMG_8229.jpg","IMG_8235.jpg","IMG_8283.jpg","IMG_8284.jpg","IMG_8285.jpg",
  "IMG_8286.jpg","IMG_8305.jpg","IMG_8306.jpg","IMG_8307.jpg","IMG_8308.jpg",
  "IMG_8311.jpg","IMG_8312.jpg",
];

function pickRandom(arr: string[], n: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function Hero() {
  const bgImages = useMemo(() => pickRandom(ALL_IMAGES, 6), []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {bgImages.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={`/images/products/${img}`}
              alt=""
              fill
              className="object-cover scale-110"
              priority={i < 3}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay with forest-tinted gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-900/70 to-forest-950/90" />

      {/* Decorative leaves SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z"
          fill="#f5f0e8"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo badge */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-white/60 shadow-2xl">
            <Image
              src="/images/logo/logo.jpg"
              alt="TuftForest GT"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <p className="text-forest-300 uppercase tracking-widest text-sm mb-3">
          Hecho a mano · Guatemala
        </p>

        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Alfombras que
          <br />
          <span className="text-forest-300">cuentan tu historia</span>
        </h1>

        <p className="text-white/80 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Piezas únicas tejidas con amor, inspiradas en la naturaleza y
          diseñadas para transformar cualquier espacio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#catalogo" className="btn-primary text-lg py-4 px-10">
            <span>Ver Catálogo</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/tuftforest_gt"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/60 text-white hover:bg-white/20 px-10 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2 text-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { n: "100%", label: "Hecho a mano" },
            { n: "GT", label: "Con orgullo guatemalteco" },
            { n: "∞", label: "Diseños personalizados" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-forest-300 text-2xl font-bold">{s.n}</div>
              <div className="text-white/60 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
