"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { img as withBase } from "../lib/basePath";

const FEATURED = [
  "IMG_8870.webp",
  "IMG_8575.webp",
  "IMG_8875.webp",
  "IMG_8559.webp",
  "IMG_8740.webp",
  "IMG_8884.webp",
  "IMG_8913.webp",
  "IMG_8597.webp",
  "IMG_8550.webp",
  "IMG_8922.webp",
  "IMG_8537.webp",
  "IMG_8675.webp",
];

export default function FeaturedCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-forest-500 uppercase tracking-widest text-sm mb-2">
          Lo Más Reciente
        </p>
        <h2 className="section-title">Últimas Creaciones</h2>
        <p className="section-subtitle">
          Piezas recién terminadas — cada una única, tejida a mano.
        </p>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pl-6">
          {FEATURED.map((img) => (
            <div
              key={img}
              className="relative flex-[0_0_260px] md:flex-[0_0_320px] h-80 rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
            >
              <Image
                src={withBase(`/images/products/${img}`)}
                alt="Alfombra destacada TuftForest GT"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
