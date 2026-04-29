import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        <Link to="/" className="flex items-center gap-2 group">
          <Sun className="w-7 h-7 text-primary transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-lg font-bold text-foreground tracking-tight">
            Use + Energia Solar
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/sobre"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Sobre nós
          </Link>
          <Link
            to="/pesquisa"
            className="relative text-sm font-semibold px-5 py-2.5 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105"
            onClick={() => window.dispatchEvent(new Event("reset-survey"))}
          >
            <span className="relative z-10">Participe da pesquisa</span>
            <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-6">
              <Link
                to="/"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/sobre"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Sobre nós
              </Link>
              <Link
                to="/pesquisa"
                className="relative text-lg font-semibold px-5 py-3 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105 inline-block"
                onClick={() => {
                  window.dispatchEvent(new Event("reset-survey"));
                  setIsOpen(false);
                }}
              >
                <span className="relative z-10">Participe da pesquisa</span>
                <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
