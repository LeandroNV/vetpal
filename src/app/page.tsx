import CtaFinal from "@/components/landing/cta-final";
import ComoFunciona from "@/components/landing/como-funciona";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import ServiciosSection from "@/components/landing/servicios-section";
import Stats from "@/components/landing/stats";
import Testimonios from "@/components/landing/testimonios";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <ServiciosSection />
      <ComoFunciona />
      <Testimonios />
      <CtaFinal />
      <Footer />
    </main>
  );
}
