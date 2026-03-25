"use client";

import { useState, useMemo } from "react";
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

const PAGE_SIZE = 18;

export default function Catalog() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<string | null>(null);

  const shuffled = useMemo(
    () => [...ALL_IMAGES].sort(() => Math.random() - 0.5),
    []
  );
  const shown = shuffled.slice(0, visible);

  return (
    <section id="catalogo" className="py-24 bg-mist">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-forest-500 uppercase tracking-widest text-sm mb-2">
            Nuestros Trabajos
          </p>
          <h2 className="section-title">Catálogo de Alfombras</h2>
          <p className="section-subtitle">
            Cada pieza es única — diseñada y tejida a mano con técnica tufting.
            Pedí la tuya con el diseño que imaginás.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {shown.map((img) => (
            <button
              key={img}
              onClick={() => setSelected(img)}
              className="relative aspect-square overflow-hidden rounded-xl group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={`/images/products/${img}`}
                alt="Alfombra TuftForest GT"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/30 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Load more */}
        {visible < ALL_IMAGES.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-outline"
            >
              Ver más diseños ({ALL_IMAGES.length - visible} restantes)
            </button>
          </div>
        )}

        {/* CTA after catalog */}
        <div className="mt-16 bg-forest-800 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
            ¿Tienes una idea en mente?
          </h3>
          <p className="text-forest-200 mb-6 text-lg">
            Creamos alfombras 100% personalizadas. Cuéntanos tu diseño y lo hacemos realidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/tuftforest_gt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-forest-800 hover:bg-forest-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Escribir por Instagram
            </a>
            <a
              href="https://www.tiktok.com/@tuftforest_gt"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white/20 px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
              </svg>
              Ver en TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <Image
              key={selected}
              src={`/images/products/${selected}`}
              alt="Alfombra TuftForest GT"
              width={900}
              height={900}
              className="object-contain max-h-[90vh] rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Contact CTA on lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <a
                href="https://www.instagram.com/tuftforest_gt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-forest-700 hover:bg-forest-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Quiero una igual — Escribir por DM
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
