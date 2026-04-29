import solarFamily from "@/assets/solar-family.avif";
import solarHands from "@/assets/solar-hands.jpg";
import solarHero from "@/assets/solar-hero.jpg";
import solarInstall from "@/assets/solar-install.jpg";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Battery, Calculator, DollarSign, Leaf, Sun, TrendingDown, Zap } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/* ── Scroll-reveal card (IntersectionObserver — works inside pinned/horizontal) ── */
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
const DAYS_PER_MONTH = 30;
const SOLAR_IRRADIATION_RATE = 4.32;
const SAFETY_MARGIN = 0.75;
const AVERAGE_TARIFF_BRL_PER_KWH = 1;
const GRID_EMISSION_KG_CO2_PER_KWH = 0.0289;
const KG_CO2_PER_TREE_PER_YEAR = 60;

const PRICE_TABLE = [
  { maxKwp: 2.99, pricePerKwp: 4600 },
  { maxKwp: 3, pricePerKwp: 3500 },
  { maxKwp: 4, pricePerKwp: 3250 },
  { maxKwp: 5, pricePerKwp: 3000 },
  { maxKwp: 8, pricePerKwp: 2800 },
  { maxKwp: 10, pricePerKwp: 2600 },
  { maxKwp: 20, pricePerKwp: 2400 },
  { maxKwp: 50, pricePerKwp: 2200 },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

const getPricePerKwp = (kwp: number) =>
  PRICE_TABLE.find((item) => kwp <= item.maxKwp)?.pricePerKwp ?? 2000;

const Index = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [monthlyConsumption, setMonthlyConsumption] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculatorResult = useMemo(() => {
    const consumption = Number(monthlyConsumption.replace(",", "."));

    if (!Number.isFinite(consumption) || consumption <= 0) {
      return null;
    }

    const kwp = consumption / DAYS_PER_MONTH / SOLAR_IRRADIATION_RATE / SAFETY_MARGIN;
    const pricePerKwp = getPricePerKwp(kwp);
    const systemCost = kwp * pricePerKwp;
    const annualSavings = consumption * AVERAGE_TARIFF_BRL_PER_KWH * 12;
    const paybackYears = systemCost / annualSavings;
    const avoidedCo2KgPerYear = consumption * 12 * GRID_EMISSION_KG_CO2_PER_KWH;
    const preservedTrees = avoidedCo2KgPerYear / KG_CO2_PER_TREE_PER_YEAR;

    return {
      annualSavings,
      avoidedCo2KgPerYear,
      kwp,
      paybackYears,
      preservedTrees,
      pricePerKwp,
      systemCost,
    };
  }, [monthlyConsumption]);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasCalculated(true);
  };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current;
      const wrapper = wrapperRef.current;
      if (!track || !wrapper) return;

      // Animate the track from x=0 to x=-(N-1)*viewportWidth
      gsap.to(track, {
        x: () => -(window.innerWidth * (TOTAL_PANELS - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          anticipatePin: 1,
          start: "top top",
          end: () => "+=" + window.innerWidth * (TOTAL_PANELS - 1),
          scrub: 0.5,
          snap: {
            snapTo: 1 / (TOTAL_PANELS - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
            ease: "power1.inOut",
          },
          invalidateOnRefresh: true,
        },
      });

      // Recalculate after images finish loading
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    });

    return () => mm.revert();
  }, []);

  return (
    <div>
      <Navbar />
      <ScrollToTop />

      {/* Hero Section */}
      <section id="home" className="section-full relative flex items-center justify-center">
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

      {/* ── Horizontal Scroll Section (Desktop) / Vertical (Mobile) ── */}
      <div ref={wrapperRef} className="horizontal-wrapper">
        <div ref={trackRef} className="horizontal-scroll">

          {/* Panel 1 — Economia */}
          <div className="horizontal-panel">
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

          {/* Panel 2 — Sustentabilidade */}
          <div className="horizontal-panel">
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

          {/* Panel 3 — Acessibilidade */}
          <div className="horizontal-panel">
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
      {/* Hardcoded, criar como componente */}
      <section className="section-full px-4 md:px-6">
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
                    Insira a média de consumo dos 3 últimos meses, ou a fatura atual de energia.
                    A partir do seu consumo mensal em kWh, estimaremos o tamanho do sistema, o
                    investimento, o retorno e o impacto ambiental.
                  </p>
                </div>

                <div className="bg-background border border-border p-4 md:p-8 space-y-4 md:space-y-5">
                  <form onSubmit={handleCalculate} className="space-y-4 md:space-y-5">
                    <label className="block">
                      <span className="text-xs text-muted-foreground mb-2 uppercase tracking-wider block">
                        Consumo mensal (kWh)
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={monthlyConsumption}
                        onChange={(event) => setMonthlyConsumption(event.target.value)}
                        placeholder="Ex.: 450"
                        className="h-11 w-full bg-muted/50 border border-border px-4 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    <button
                      type="submit"
                      className="h-11 w-full bg-primary text-primary-foreground font-bold text-sm transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      Calcular
                    </button>
                  </form>

                  {hasCalculated && calculatorResult ? (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                        <div className="bg-muted/30 border border-border p-3 text-center">
                          <p className="text-xs text-muted-foreground">Sistema indicado</p>
                          <p className="text-base md:text-lg font-bold text-foreground mt-1">
                            {numberFormatter.format(calculatorResult.kwp)} kWp
                          </p>
                        </div>
                        <div className="bg-muted/30 border border-border p-3 text-center">
                          <p className="text-xs text-muted-foreground">Investimento</p>
                          <p className="text-base md:text-lg font-bold text-foreground mt-1">
                            {currencyFormatter.format(calculatorResult.systemCost)}
                          </p>
                        </div>
                        <div className="bg-muted/30 border border-border p-3 text-center">
                          <p className="text-xs text-muted-foreground">Retorno</p>
                          <p className="text-base md:text-lg font-bold text-foreground mt-1">
                            {numberFormatter.format(calculatorResult.paybackYears)} anos
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-[hsl(var(--solar-green))]/10 border border-[hsl(var(--solar-green))]/30 p-3 text-center">
                          <p className="text-xs text-muted-foreground">CO₂ evitado por ano</p>
                          <p className="text-base md:text-lg font-bold text-foreground mt-1">
                            {numberFormatter.format(calculatorResult.avoidedCo2KgPerYear)} kg
                          </p>
                        </div>
                        <div className="bg-[hsl(var(--solar-green))]/10 border border-[hsl(var(--solar-green))]/30 p-3 text-center">
                          <p className="text-xs text-muted-foreground">Árvores equivalentes</p>
                          <p className="text-base md:text-lg font-bold text-foreground mt-1">
                            {numberFormatter.format(calculatorResult.preservedTrees)} por ano
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Preço aplicado: {currencyFormatter.format(calculatorResult.pricePerKwp)}/kWp.
                        Economia anual estimada: {currencyFormatter.format(calculatorResult.annualSavings)}.
                      </p>
                    </div>
                  ) : hasCalculated ? (
                    <p className="text-sm text-destructive">
                      Informe um consumo mensal válido em kWh para calcular.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* CTA Pesquisa */}
      <section id="pesquisa" className="section-full px-4 md:px-6">
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
              <Link
                to="/survey"
                className="inline-block chamfer-card-sm bg-primary-foreground text-primary font-bold text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 hover:scale-105 transition-transform duration-300"
              >
                Responder pesquisa →
              </Link>
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
