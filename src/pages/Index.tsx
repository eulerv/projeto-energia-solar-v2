import solarFamily from "@/assets/solar-family.avif";
import solarHands from "@/assets/solar-hands.jpg";
import solarHero from "@/assets/solar-hero.jpg";
import solarInstall from "@/assets/solar-install.jpg";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Battery, Calculator, DollarSign, Leaf, Sun, TrendingDown, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

const ScrollCard = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) => {
  const { ref, isVisible } = useScrollReveal(0.15);

  const transforms = {
    up: "translate-y-16",
    left: "translate-x-[-60px]",
    right: "translate-x-[60px]",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${transforms[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TOTAL_PANELS = 3;

const Index = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPanel = useRef(0);
  const isTransitioning = useRef(false);
  const isLocked = useRef(false);

  useEffect(() => {
    const snapContainer = document.querySelector('.snap-container') as HTMLElement;
    if (!snapContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Only enable horizontal scroll on desktop (md and above)
      if (window.innerWidth < 768) return;

      const container = containerRef.current;
      const horizontal = horizontalRef.current;
      if (!container || !horizontal) return;

      const rect = container.getBoundingClientRect();
      // Check if the horizontal section is snapped (visible and near top)
      const isSnapped = rect.top > -50 && rect.top < 50;

      if (!isSnapped && !isLocked.current) return;

      // Once we enter, lock until all panels are traversed
      if (isSnapped && !isLocked.current) {
        isLocked.current = true;
        // Determine current panel from scroll position
        const panelWidth = horizontal.clientWidth;
        currentPanel.current = Math.round(horizontal.scrollLeft / panelWidth);
      }

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // At first panel scrolling up → release lock, let vertical scroll happen
      if (goingUp && currentPanel.current === 0) {
        isLocked.current = false;
        return;
      }

      // At last panel scrolling down → release lock, let vertical scroll happen
      if (goingDown && currentPanel.current === TOTAL_PANELS - 1) {
        isLocked.current = false;
        return;
      }

      // Otherwise, consume the scroll event and move horizontally
      e.preventDefault();

      if (isTransitioning.current) return;

      isTransitioning.current = true;

      if (goingDown) {
        currentPanel.current = Math.min(currentPanel.current + 1, TOTAL_PANELS - 1);
      } else if (goingUp) {
        currentPanel.current = Math.max(currentPanel.current - 1, 0);
      }

      const target = currentPanel.current * horizontal.clientWidth;
      horizontal.scrollTo({ left: target, behavior: "smooth" });

      // Cooldown to prevent skipping
      setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
    };

    snapContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => snapContainer.removeEventListener("wheel", handleWheel);
  }, []);
  return (
    <div className="snap-container">
      <Navbar />
      <ScrollToTop />

      {/* Hero Section */}
      <section id="home" className="snap-section relative flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={solarHero}
            alt="Campo de painéis solares ao pôr do sol"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-center">
          <ScrollCard>
            <div className="chamfer-card bg-primary/10 backdrop-blur-sm border border-primary/20 p-10 md:p-16 lg:p-20 max-w-5xl mx-auto">
              <p className="text-sm uppercase tracking-[0.3em] text-primary mb-6 font-medium">
                Use + Energia Solar
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] mb-8">
                Energia solar não é mais o futuro.{" "}
                <span className="text-gradient-solar">Ela é o presente.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
                Descubra como a energia solar está transformando vidas, reduzindo custos e
                protegendo o planeta.
              </p>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Horizontal Scroll Container — Sections 2, 3, 4 (Desktop) / Vertical Sections (Mobile) */}
      <div ref={containerRef} className="snap-section relative md:h-[100vh] h-auto">
        <div
          ref={horizontalRef}
          className="horizontal-scroll md:flex md:flex-row flex-col"
        >
          {/* Card 1 — Economia */}
          <div className="horizontal-panel md:min-w-[100vw] md:h-[100vh] h-auto py-12 md:py-0">
            <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-stretch">
              <ScrollCard direction="left" className="md:col-span-3">
                <div className="chamfer-card bg-primary p-6 md:p-12 lg:p-14 text-primary-foreground h-full">
                  <TrendingDown className="w-8 h-8 md:w-12 md:h-12 mb-4 md:mb-6" />
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-4 md:mb-6">
                    Economize até 95% na sua conta de luz.
                  </h2>
                  <p className="text-primary-foreground/80 text-sm md:text-lg leading-relaxed">
                    O investimento em energia solar se paga em poucos anos e gera economia por
                    décadas. Uma energia renovável e limpa, que agora se consolida como realidade no Brasil.
                  </p>
                </div>
              </ScrollCard>

              <ScrollCard direction="right" delay={200} className="md:col-span-2">
                <div className="chamfer-card-right overflow-hidden h-full min-h-[250px] md:min-h-[400px]">
                  <img
                    src={solarInstall}
                    alt="Trabalhador instalando painéis solares"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
              </ScrollCard>
            </div>
          </div>

          {/* Card 2 — Sustentabilidade */}
          <div className="horizontal-panel md:min-w-[100vw] md:h-[100vh] h-auto py-12 md:py-0">
            <div id="sobre" className="max-w-[1400px] mx-auto w-full px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <ScrollCard direction="left" className="md:col-span-5 md:row-span-2">
                <div className="chamfer-card overflow-hidden h-full min-h-[300px] md:min-h-[400px]">
                  <img
                    src={solarFamily}
                    alt="Família em frente a casa com energia solar"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={600}
                    height={800}
                  />
                </div>
              </ScrollCard>

              <ScrollCard direction="right" delay={100} className="md:col-span-7">
                <div className="chamfer-card-right bg-[hsl(var(--solar-green))] p-6 md:p-10 text-primary-foreground h-full">
                  <Leaf className="w-8 h-8 md:w-10 md:h-10 mb-4" />
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-black leading-tight mb-4">
                    Energia limpa. Planeta vivo.
                  </h2>
                  <p className="text-primary-foreground/80 text-sm md:text-lg leading-relaxed">
                    Cada painel solar instalado reduz a emissão de CO₂ em toneladas por ano.
                    Diferente das fontes fósseis, a energia solar não polui, não faz barulho e
                    não destrói ecossistemas.
                  </p>
                </div>
              </ScrollCard>

              <ScrollCard direction="right" delay={250} className="md:col-span-4">
                <div className="chamfer-card-sm bg-secondary p-4 md:p-8 h-full">
                  <Battery className="w-6 h-6 md:w-8 md:h-8 text-primary mb-3" />
                  <p className="text-base md:text-xl font-bold text-foreground mb-2">25+ anos</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Vida útil média de um sistema solar residencial</p>
                </div>
              </ScrollCard>

              <ScrollCard direction="right" delay={400} className="md:col-span-3">
                <div className="chamfer-card-sm bg-secondary p-4 md:p-8 h-full">
                  <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[hsl(var(--solar-green))] mb-3" />
                  <p className="text-base md:text-xl font-bold text-foreground mb-2">4-6 anos</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Retorno do investimento</p>
                </div>
              </ScrollCard>
            </div>
          </div>

          {/* Card 3 — Acessibilidade */}
          <div className="horizontal-panel md:min-w-[100vw] md:h-[100vh] h-auto py-12 md:py-0">
            <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <ScrollCard direction="left">
                <div className="chamfer-card bg-secondary p-6 md:p-12 lg:p-16">
                  <Zap className="w-10 h-10 md:w-14 md:h-14 text-primary mb-4 md:mb-6" />
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4 md:mb-6">
                    Faça parte desse movimento, a energia solar é para todos.
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                    Uma tecnologia acessível, cada vez mais barata e durável, financiamento acessível, energia limpa sem emissão de carbono. O futuro é agora.
                  </p>
                </div>
              </ScrollCard>

              <ScrollCard direction="right" delay={200}>
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <div className="chamfer-card-sm overflow-hidden">
                    <img
                      src={solarHands}
                      alt="Mãos segurando painel solar"
                      className="w-full h-[150px] md:h-[240px] object-cover"
                      loading="lazy"
                      width={600}
                      height={600}
                    />
                  </div>
                  <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-4 md:p-6 flex flex-col justify-center">
                    <p className="text-lg md:text-3xl font-black text-gradient-solar">2 milhões+</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Sistemas instalados no Brasil</p>
                  </div>
                  <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-4 md:p-6 flex flex-col justify-center">
                    <p className="text-lg md:text-3xl font-black text-gradient-solar">R$ 200 bi</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Investidos desde 2012</p>
                  </div>
                  <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-4 md:p-6 flex flex-col justify-center">
                    <p className="text-lg md:text-3xl font-black text-gradient-solar">40 GW</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">De capacidade instalada</p>
                  </div>
                </div>
              </ScrollCard>
            </div>
          </div>
        </div>
      </div>

      {/* Calculadora Solar — Esboço */}
      <section className="snap-section flex items-center px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto w-full">
          <ScrollCard>
            <div className="chamfer-card bg-secondary border border-border p-6 md:p-14 lg:p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                <div>
                  <Calculator className="w-8 h-8 md:w-12 md:h-12 text-primary mb-4 md:mb-6" />
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4">
                    Calcule seu potencial{" "}
                    <span className="text-gradient-solar">#solar</span>
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
                    Descubra quanto você pode economizar com energia solar. Insira o valor
                    da sua conta de luz e veja a estimativa de economia, retorno do
                    investimento e impacto ambiental.
                  </p>
                  <span className="inline-block chamfer-card-sm bg-primary/10 border border-primary/20 text-primary font-semibold text-sm px-4 md:px-6 py-2 md:py-3">
                    Em breve
                  </span>
                </div>

                <div className="chamfer-card-sm bg-background border border-border p-4 md:p-8 space-y-4 md:space-y-5 opacity-60">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Valor da conta de luz (R$)</p>
                    <div className="h-10 md:h-11 bg-muted/50 border border-border chamfer-card-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Estado</p>
                    <div className="h-10 md:h-11 bg-muted/50 border border-border chamfer-card-sm" />
                  </div>
                  <div className="h-10 md:h-11 bg-primary/20 border border-primary/30 chamfer-card-sm flex items-center justify-center">
                    <p className="text-primary font-bold text-sm">Calcular economia</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
                    <div className="chamfer-card-sm bg-muted/30 border border-border p-2 md:p-3 text-center">
                      <p className="text-xs text-muted-foreground">Economia/mês</p>
                      <p className="text-sm font-bold text-foreground mt-1">R$ ---</p>
                    </div>
                    <div className="chamfer-card-sm bg-muted/30 border border-border p-2 md:p-3 text-center">
                      <p className="text-xs text-muted-foreground">Retorno</p>
                      <p className="text-sm font-bold text-foreground mt-1">-- anos</p>
                    </div>
                    <div className="chamfer-card-sm bg-muted/30 border border-border p-2 md:p-3 text-center">
                      <p className="text-xs text-muted-foreground">CO₂ evitado</p>
                      <p className="text-sm font-bold text-foreground mt-1">-- ton</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* CTA Pesquisa */}
      <section id="pesquisa" className="snap-section flex items-center px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto max-w-5xl text-center w-full">
          <ScrollCard>
            <div className="chamfer-card bg-primary p-8 md:p-16 lg:p-20">
              <Sun className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground mx-auto mb-6 md:mb-8 animate-spin" style={{ animationDuration: '8s' }} />
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-primary-foreground leading-tight mb-4 md:mb-6">
                Participe da nossa pesquisa
              </h2>
              <p className="text-primary-foreground/80 text-sm md:text-lg max-w-xl mx-auto mb-8 md:mb-10">
                Sua opinião é essencial. Ajude-nos a entender como as pessoas enxergam a
                energia solar e como podemos promovê-la juntos.
              </p>
              <a
                href="#"
                className="inline-block chamfer-card-sm bg-primary-foreground text-primary font-bold text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 hover:scale-105 transition-transform duration-300"
              >
                Responder pesquisa →
              </a>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 md:py-10 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Use + Energia Solar — Projeto acadêmico
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 · Feito com ☀️ para um futuro mais sustentável
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
