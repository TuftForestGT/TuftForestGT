import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCarousel from "./components/FeaturedCarousel";
import Catalog from "./components/Catalog";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCarousel />
        <Catalog />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
