"use client";

import { useState, useEffect } from "react";
import { img as withBase } from "../lib/basePath";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ALL_IMAGES = [
  "IMG_6534.jpg", "IMG_6535.jpg", "IMG_6536.jpg", "IMG_6793.jpg", "IMG_6805.jpg",
  "IMG_6892.jpg", "IMG_6923.jpg", "IMG_6927.jpg", "IMG_6929.jpg", "IMG_7045.jpg",
  "IMG_7048.jpg", "IMG_7068.jpg", "IMG_7158.jpg", "IMG_7169.jpg", "IMG_7173.jpg",
  "IMG_7268.jpg", "IMG_7365.jpg", "IMG_7410.jpg", "IMG_7411.jpg", "IMG_7469.jpg",
  "IMG_7483.jpg", "IMG_7484.jpg", "IMG_7566.jpg", "IMG_7567.jpg", "IMG_7572.jpg",
  "IMG_7573.jpg", "IMG_7574.jpg", "IMG_7598.jpg", "IMG_7599.jpg", "IMG_7600.jpg",
  "IMG_7603.jpg", "IMG_7604.jpg", "IMG_7605.jpg", "IMG_7606.jpg", "IMG_7609.jpg",
  "IMG_7616.jpg", "IMG_7617.jpg", "IMG_7618.jpg", "IMG_7621.jpg", "IMG_7632.jpg",
  "IMG_7633.jpg", "IMG_7634.jpg", "IMG_7635.jpg", "IMG_7642.jpg", "IMG_7643.jpg",
  "IMG_7676.jpg", "IMG_7678.jpg", "IMG_7679.jpg", "IMG_7683.jpg", "IMG_7684.jpg",
  "IMG_7686.jpg", "IMG_7687.jpg", "IMG_7690.jpg", "IMG_7691.jpg", "IMG_7692.jpg",
  "IMG_7695.jpg", "IMG_7696.jpg", "IMG_7697.jpg", "IMG_7698.jpg", "IMG_7707.jpg",
  "IMG_7708.jpg", "IMG_7713.jpg", "IMG_7716.jpg", "IMG_7717.jpg", "IMG_7718.jpg",
  "IMG_7720.jpg", "IMG_7721.jpg", "IMG_7722.jpg", "IMG_7723.jpg", "IMG_7743.jpg",
  "IMG_7744.jpg", "IMG_7747.jpg", "IMG_7748.jpg", "IMG_7750.jpg", "IMG_7751.jpg",
  "IMG_7761.jpg", "IMG_7762.jpg", "IMG_7763.jpg", "IMG_7764.jpg", "IMG_7765.jpg",
  "IMG_7766.jpg", "IMG_7768.jpg", "IMG_7782.jpg", "IMG_7783.jpg", "IMG_7784.jpg",
  "IMG_7786.jpg", "IMG_7788.jpg", "IMG_7789.jpg", "IMG_7791.jpg", "IMG_7792.jpg",
  "IMG_7793.jpg", "IMG_7796.jpg", "IMG_7797.jpg", "IMG_7798.jpg", "IMG_7806.jpg",
  "IMG_7807.jpg", "IMG_7860.jpg", "IMG_7862.jpg", "IMG_7866.jpg", "IMG_7867.jpg",
  "IMG_7871.jpg", "IMG_7874.jpg", "IMG_7875.jpg", "IMG_7880.jpg", "IMG_7881.jpg",
  "IMG_7990.jpg", "IMG_7991.jpg", "IMG_7993.jpg", "IMG_7994.jpg", "IMG_7995.jpg",
  "IMG_8001.jpg", "IMG_8002.jpg", "IMG_8018.jpg", "IMG_8019.jpg", "IMG_8023.jpg",
  "IMG_8024.jpg", "IMG_8028.jpg", "IMG_8029.jpg", "IMG_8030.jpg", "IMG_8031.jpg",
  "IMG_8033.jpg", "IMG_8034.jpg", "IMG_8035.jpg", "IMG_8036.jpg", "IMG_8037.jpg",
  "IMG_8061.jpg", "IMG_8063.jpg", "IMG_8065.jpg", "IMG_8066.jpg", "IMG_8206.jpg",
  "IMG_8207.jpg", "IMG_8208.jpg", "IMG_8209.jpg", "IMG_8210.jpg", "IMG_8211.jpg",
  "IMG_8214.jpg", "IMG_8218.jpg", "IMG_8219.jpg", "IMG_8220.jpg", "IMG_8221.jpg",
  "IMG_8229.jpg", "IMG_8235.jpg", "IMG_8283.jpg", "IMG_8284.jpg", "IMG_8285.jpg",
  "IMG_8286.jpg", "IMG_8305.jpg", "IMG_8306.jpg", "IMG_8307.jpg", "IMG_8308.jpg",
  "IMG_8311.jpg", "IMG_8312.jpg", "IMG_8283.webp",
  "IMG_8284.webp",
  "IMG_8285.webp",
  "IMG_8286.webp",
  "IMG_8293.webp",
  "IMG_8294.webp",
  "IMG_8298.webp",
  "IMG_8299.webp",
  "IMG_8300.webp",
  "IMG_8301.webp",
  "IMG_8302.webp",
  "IMG_8303.webp",
  "IMG_8304.webp",
  "IMG_8305.webp",
  "IMG_8306.webp",
  "IMG_8307.webp",
  "IMG_8308.webp",
  "IMG_8311.webp",
  "IMG_8312.webp",
  "IMG_8314.webp",
  "IMG_8315.webp",
  "IMG_8355.webp",
  "IMG_8356.webp",
  "IMG_8357.webp",
  "IMG_8415.webp",
  "IMG_8416.webp",
  "IMG_8417.webp",
  "IMG_8418.webp",
  "IMG_8419.webp",
  "IMG_8420.webp",
  "IMG_8421.webp",
  "IMG_8422.webp",
  "IMG_8423.webp",
  "IMG_8424.webp",
  "IMG_8450.webp",
  "IMG_8451.webp",
  "IMG_8452.webp",
  "IMG_8453.webp",
  "IMG_8454.webp",
  "IMG_8455.webp",
  "IMG_8456.webp",
  "IMG_8458.webp",
  "IMG_8459.webp",
  "IMG_8460.webp",
  "IMG_8461.webp",
  "IMG_8462.webp",
  "IMG_8537.webp",
  "IMG_8538.webp",
  "IMG_8539.webp",
  "IMG_8541.webp",
  "IMG_8542.webp",
  "IMG_8543.webp",
  "IMG_8544.webp",
  "IMG_8549.webp",
  "IMG_8550.webp",
  "IMG_8551.webp",
  "IMG_8552.webp",
  "IMG_8553.webp",
  "IMG_8554.webp",
  "IMG_8557.webp",
  "IMG_8558.webp",
  "IMG_8559.webp",
  "IMG_8569.webp",
  "IMG_8574.webp",
  "IMG_8575.webp",
  "IMG_8597.webp",
  "IMG_8602.webp",
  "IMG_8603.webp",
  "IMG_8606.webp",
  "IMG_8610.webp",
  "IMG_8611.webp",
  "IMG_8612.webp",
  "IMG_8632.webp",
  "IMG_8633.webp",
  "IMG_8635.webp",
  "IMG_8636.webp",
  "IMG_8638.webp",
  "IMG_8644.webp",
  "IMG_8654.webp",
  "IMG_8655.webp",
  "IMG_8656.webp",
  "IMG_8670.webp",
  "IMG_8671.webp",
  "IMG_8672.webp",
  "IMG_8673.webp",
  "IMG_8675.webp",
  "IMG_8680.webp",
  "IMG_8681.webp",
  "IMG_8684.webp",
  "IMG_8685.webp",
  "IMG_8686.webp",
  "IMG_8687.webp",
  "IMG_8688.webp",
  "IMG_8689.webp",
  "IMG_8690.webp",
  "IMG_8692.webp",
  "IMG_8694.webp",
  "IMG_8695.webp",
  "IMG_8696.webp",
  "IMG_8697.webp",
  "IMG_8704.webp",
  "IMG_8706.webp",
  "IMG_8707.webp",
  "IMG_8708.webp",
  "IMG_8709.webp",
  "IMG_8710.webp",
  "IMG_8711.webp",
  "IMG_8713.webp",
  "IMG_8719.webp",
  "IMG_8720.webp",
  "IMG_8721.webp",
  "IMG_8722.webp",
  "IMG_8723.webp",
  "IMG_8731.webp",
  "IMG_8738.webp",
  "IMG_8740.webp",
  "IMG_8741.webp",
  "IMG_8743.webp",
  "IMG_8752.webp",
  "IMG_8753.webp",
  "IMG_8870.webp",
  "IMG_8871.webp",
  "IMG_8872.webp",
  "IMG_8873.webp",
  "IMG_8874.webp",
  "IMG_8875.webp",
  "IMG_8876.webp",
  "IMG_8878.webp",
  "IMG_8879.webp",
  "IMG_8880.webp",
  "IMG_8881.webp",
  "IMG_8882.webp",
  "IMG_8883.webp",
  "IMG_8884.webp",
  "IMG_8885.webp",
  "IMG_8886.webp",
  "IMG_8913.webp",
  "IMG_8914.webp",
  "IMG_8915.webp",
  "IMG_8916.webp",
  "IMG_8918.webp",
  "IMG_8919.webp",
  "IMG_8922.webp",
  "IMG_8923.webp",
  "IMG_8925.webp",
  "IMG_8928.webp",
  "IMG_8929.webp",
  "IMG_0033.webp",
  "IMG_0034.webp",
  "IMG_0037.webp",
  "IMG_0038.webp",
  "IMG_0040.webp",
  "IMG_0041.webp",
  "IMG_0043.webp",
  "IMG_0046.webp",
  "IMG_0048.webp",
  "IMG_0049.webp",
  "IMG_0051.webp",
  "IMG_0052.webp",
  "IMG_0053.webp",
  "IMG_0105.webp",
  "IMG_0106.webp",
  "IMG_0108(1).webp",
  "IMG_0108.webp",
  "IMG_0109(1).webp",
  "IMG_0109.webp",
  "IMG_0113(1).webp",
  "IMG_0113.webp",
  "IMG_0119(1).webp",
  "IMG_0119.webp",
  "IMG_0120.webp",
  "IMG_0123(1).webp",
  "IMG_0123.webp",
  "IMG_0124(1).webp",
  "IMG_0124.webp",
  "IMG_0125(1).webp",
  "IMG_0125.webp",
  "IMG_0126(1).webp",
  "IMG_0126.webp",
  "IMG_0127(1).webp",
  "IMG_0127.webp",
  "IMG_0132.webp",
  "IMG_0133.webp",
  "IMG_0137(1).webp",
  "IMG_0137.webp",
  "IMG_0140.webp",
  "IMG_0141.webp",
  "IMG_0142(1).webp",
  "IMG_0142.webp",
  "IMG_0143.webp",
  "IMG_0144.webp",
  "IMG_0147(1).webp",
  "IMG_0147.webp",
  "IMG_0148.webp",
  "IMG_0149.webp",
  "IMG_0150.webp",
  "IMG_0152.webp",
  "IMG_0153(1).webp",
  "IMG_0153.webp",
  "IMG_0154.webp",
  "IMG_0156.webp",
  "IMG_0157(1).webp",
  "IMG_0157.webp",
  "IMG_0158(1).webp",
  "IMG_0158.webp",
  "IMG_0159(1).webp",
  "IMG_0159.webp",
  "IMG_0289.webp",
  "IMG_0290.webp",
  "IMG_0291.webp",
  "IMG_0293.webp",
  "IMG_0294.webp",
  "IMG_0295.webp",
  "IMG_0296.webp",
  "IMG_0297.webp",
  "IMG_0298.webp",
  "IMG_0308.webp",
  "IMG_0309.webp",
  "IMG_0311.webp",
  "IMG_0312.webp",
  "IMG_0313.webp",
  "IMG_0315.webp",
  "IMG_0319.webp",
  "IMG_0320.webp",
  "IMG_0324.webp",
  "IMG_0329.webp",
  "IMG_0334.webp",
  "IMG_0335.webp",
  "IMG_0336.webp",
  "IMG_0337.webp",
  "IMG_0338.webp",
  "IMG_0340.webp",
  "IMG_0341.webp",
  "IMG_0342.webp",
  "IMG_0345.webp",
  "IMG_0346.webp",
  "IMG_0352.webp",
  "IMG_0354.webp",
  "IMG_0355.webp",
  "IMG_0357.webp",
  "IMG_0420.webp",
  "IMG_0421.webp",
  "IMG_0422.webp",
  "IMG_0423.webp",
  "IMG_0426.webp",
  "IMG_0427.webp",
  "IMG_0428.webp",
];

const PAGE_SIZE = 18;

export default function Catalog() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [shuffled, setShuffled] = useState(ALL_IMAGES);

  useEffect(() => {
    setShuffled([...ALL_IMAGES].sort(() => Math.random() - 0.5));
  }, []);

  const shown = shuffled.slice(0, visible);
  const slides = shown.map((img) => ({ src: withBase(`/images/products/${img}`) }));

  return (
    <section id="catalogo" className="py-12 bg-mist">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-forest-500 uppercase tracking-widest text-sm mb-2">
            Nuestros Trabajos
          </p>
          <h2 className="section-title">Catálogo de Alfombras</h2>
        </div>

        {/* How to buy strip */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
          {[
            { n: "1", icon: "👁", label: "Elige un diseño" },
            { n: "2", icon: "💬", label: "Escríbenos por DM" },
            { n: "3", icon: "🏠", label: "Recibe tu alfombra" },
          ].map((s) => (
            <div
              key={s.n}
              className="bg-white rounded-xl px-3 py-3 text-center shadow-sm border border-forest-100"
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-forest-700 font-semibold text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Masonry grid: real proportions, click any piece to view it large */}
        <div className="catalog-masonry">
          {shown.map((img, i) => (
            <button
              key={img}
              onClick={() => setLightboxIndex(i)}
              className="catalog-item"
              aria-label="Ver alfombra en grande"
            >
              <img
                src={withBase(`/images/products/${img}`)}
                alt="Alfombra TuftForest GT"
                loading="lazy"
                decoding="async"
                className="catalog-item__img"
              />
              <span className="catalog-item__view" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        {/* Load more */}
        {visible < ALL_IMAGES.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-outline"
            >
              Ver más diseños ({ALL_IMAGES.length - visible} restantes)
            </button>
          </div>
        )}

        {/* CTA after catalog */}
        <div className="mt-10 bg-forest-800 rounded-2xl p-7 text-center text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
            ¿Querés una alfombra personalizada?
          </h3>
          <p className="text-forest-200 mb-5 text-sm md:text-base">
            Diseño exclusivo, hecho a mano. Escribinos y lo hacemos realidad.
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
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
              </svg>
              Ver en TikTok
            </a>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3 }}
        thumbnails={{ position: "bottom", width: 80, height: 60, gap: 8 }}
      />
    </section>
  );
}
