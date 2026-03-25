export default function Contact() {
  const igUrl = "https://www.instagram.com/tuftforest_gt?igsh=a25zNndwYXBwNmps&utm_source=qr";
  const ttUrl = "https://www.tiktok.com/@tuftforest_gt?_r=1&_t=ZS-94yCs6Q96Bw";
  const igDm  = "https://www.instagram.com/direct/t/tuftforest_gt";

  const channels = [
    {
      href:  igUrl,
      label: "Instagram",
      sub:   "@tuftforest_gt",
      cta:   "Ver perfil",
      color: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      href:  ttUrl,
      label: "TikTok",
      sub:   "@tuftforest_gt",
      cta:   "Ver videos",
      color: "from-gray-900 to-gray-700",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contacto" className="py-24 bg-forest-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <circle cx="200" cy="200" r="150" fill="#3a8a3a" />
          <circle cx="600" cy="400" r="200" fill="#245724" />
          <circle cx="400" cy="100" r="100" fill="#52a552" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-forest-400 uppercase tracking-widest text-sm mb-2">
            Contáctanos
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Hagamos tu alfombra juntos
          </h2>
          <p className="text-forest-300 text-lg max-w-xl mx-auto">
            Escríbenos por cualquiera de nuestras redes. Te respondemos rápido
            y con gusto te asesoramos sin compromiso.
          </p>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-br from-forest-700 to-forest-900 rounded-3xl p-10 text-center mb-10 shadow-2xl">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-bold mb-3">Pide tu alfombra por DM</h3>
          <p className="text-forest-300 mb-6">
            La forma más rápida. Escríbenos en Instagram y te enviamos cotización en minutos.
          </p>
          <a
            href={igDm}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-forest-800 hover:bg-forest-100 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Enviar mensaje en Instagram
          </a>
        </div>

        {/* Social cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-br ${c.color} rounded-2xl p-8 flex items-center gap-6 hover:scale-105 transition-transform duration-300 shadow-xl`}
            >
              <div className="flex-shrink-0">{c.icon}</div>
              <div>
                <div className="font-bold text-xl">{c.label}</div>
                <div className="text-white/70 text-sm">{c.sub}</div>
              </div>
              <div className="ml-auto text-white/60 text-sm">{c.cta} →</div>
            </a>
          ))}
        </div>

        <p className="text-center text-forest-500 text-sm mt-12">
          Cubrimos toda Guatemala · Alfombras 100% hechas a mano
        </p>
      </div>
    </section>
  );
}
