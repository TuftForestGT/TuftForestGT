"use client";

import { useMemo } from "react";
import Image from "next/image";
import { img } from "../lib/basePath";

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

const steps = [
  {
    icon: "💬",
    title: "Cuéntanos tu idea",
    desc: "Escríbenos por Instagram o TikTok con el diseño, colores y tamaño que imaginás.",
  },
  {
    icon: "✏️",
    title: "Diseñamos juntos",
    desc: "Te enviamos una vista previa del diseño para tu aprobación antes de comenzar.",
  },
  {
    icon: "🪡",
    title: "Tejemos con amor",
    desc: "Cada hilo es colocado a mano con técnica tufting. Sin prisas, con dedicación.",
  },
  {
    icon: "📦",
    title: "Llegamos a vos",
    desc: "Enviamos a toda Guatemala. Tu alfombra llega lista para transformar tu espacio.",
  },
];

export default function About() {
  const [img1, img2] = useMemo(() => {
    const shuffled = [...ALL_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  return (
    <section id="nosotros" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">

        {/* Misión / Visión */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          {/* Images collage */}
          <div className="relative h-96 md:h-[520px]">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={img(`/images/products/${img1}`)}
                alt="Proceso tufting"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-56 h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-cream">
              <Image
                src={img(`/images/products/${img2}`)}
                alt="Alfombra terminada"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={img("/images/logo/logo.jpg")}
                alt="TuftForest GT Logo"
                fill
                className="object-cover"
              />
            </div>
            {/* Forest decoration */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-forest-200 rounded-full opacity-60" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-forest-300 rounded-full opacity-40" />
          </div>

          {/* Text */}
          <div>
            <p className="text-forest-500 uppercase tracking-widest text-sm mb-2">
              Nuestra historia
            </p>
            <h2 className="section-title">Hechas con alma,<br />pensadas para vos</h2>
            <div className="space-y-6 text-forest-700 text-lg leading-relaxed">
              <p>
                Somos <strong className="text-forest-800">TuftForest GT</strong>, una empresa guatemalteca
                apasionada por el arte textil. Creamos alfombras personalizadas usando la técnica tufting —
                cada pieza es única, igual que quien la pide.
              </p>

              <div className="bg-forest-50 border-l-4 border-forest-600 pl-6 py-4 rounded-r-xl">
                <p className="text-sm text-forest-500 uppercase tracking-wider mb-1">Misión</p>
                <p className="text-forest-800">
                  Crear alfombras personalizadas hechas a mano que permitan a cada cliente expresar
                  su estilo, personalidad y emociones, ofreciendo productos únicos de alta calidad
                  con atención cercana y dedicación en cada detalle.
                </p>
              </div>

              <div className="bg-bark/10 border-l-4 border-bark pl-6 py-4 rounded-r-xl">
                <p className="text-sm text-bark uppercase tracking-wider mb-1">Visión</p>
                <p className="text-forest-800">
                  Ser una marca reconocida en Guatemala y a nivel internacional por transformar ideas
                  en piezas textiles únicas, destacando por nuestra creatividad, innovación y
                  compromiso con el arte artesanal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="text-center mb-12">
          <p className="text-forest-500 uppercase tracking-widest text-sm mb-2">El proceso</p>
          <h2 className="section-title">¿Cómo funciona?</h2>
          <p className="section-subtitle">
            De tu idea a tu alfombra en 4 pasos simples.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-forest-100 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="w-8 h-8 bg-forest-700 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-forest-800 text-lg mb-2">{s.title}</h3>
              <p className="text-forest-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
