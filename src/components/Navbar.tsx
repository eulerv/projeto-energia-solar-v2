import { useState, useEffect } from "react";
import { Sun } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <Sun className="w-7 h-7 text-primary transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-lg font-bold text-foreground tracking-tight">
            Use + Energia Solar
          </span>
        </a>

        <div className="flex items-center gap-8">
          <a
            href="#home"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="#sobre"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Sobre
          </a>
          <a
            href="#pesquisa"
            className="relative text-sm font-semibold px-5 py-2.5 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105"
          >
            <span className="relative z-10">Participe da pesquisa</span>
            <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
