"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#inicio",   label: "Inicio" },
    { href: "#catalogo", label: "Catálogo" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-3">
          <div className={`w-10 h-10 relative rounded-full overflow-hidden border-2 transition-colors duration-300 ${scrolled ? "border-forest-600" : "border-white/80"}`}>
            <Image
              src="/images/logo/logo.jpg"
              alt="TuftForest GT Logo"
              fill
              className="object-cover"
            />
          </div>
          <span
            className={`text-xl font-bold transition-colors duration-300 ${
              scrolled ? "text-forest-800" : "text-white drop-shadow"
            }`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            TuftForest GT
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-medium transition-colors duration-300 hover:text-forest-500 ${
                scrolled ? "text-forest-800" : "text-white drop-shadow"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="btn-primary text-sm py-2 px-6"
          >
            Pedir Ahora
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-forest-800" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-forest-800" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-forest-800" : "bg-white"}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-sm border-t border-forest-200 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-forest-800 font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="btn-primary text-sm py-2 px-6 w-fit"
            onClick={() => setMenuOpen(false)}
          >
            Pedir Ahora
          </a>
        </div>
      )}
    </header>
  );
}
