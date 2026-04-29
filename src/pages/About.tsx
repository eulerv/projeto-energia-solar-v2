import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const About = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />

      <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground leading-tight">
              Sobre nós
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
