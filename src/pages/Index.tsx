import Navbar from "@/components/Navbar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sun, Leaf, TrendingDown, Zap } from "lucide-react";
import solarHero from "@/assets/solar-hero.jpg";
import solarResidential from "@/assets/solar-residential.jpg";
import solarNature from "@/assets/solar-nature.jpg";

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

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <ScrollCard>
            <div className="chamfer-card bg-primary/10 backdrop-blur-sm border border-primary/20 p-12 md:p-20 max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-[0.3em] text-primary mb-6 font-medium">
                Use + Energia Solar
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] mb-8">
                Energia solar não é mais o futuro.{" "}
                <span className="text-gradient-solar">Ela é o presente.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Descubra como a energia solar está transformando vidas, reduzindo custos e
                protegendo o planeta.
              </p>
            </div>
          </ScrollCard>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Card 1 — Economia */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <ScrollCard direction="left">
            <div className="chamfer-card bg-primary p-10 md:p-14 text-primary-foreground">
              <TrendingDown className="w-12 h-12 mb-6" />
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                Economize até 95% na sua conta de luz.
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                O investimento em energia solar se paga em poucos anos e gera economia por
                décadas. Famílias brasileiras já estão economizando milhares de reais por ano
                com painéis solares.
              </p>
            </div>
          </ScrollCard>

          <ScrollCard direction="right" delay={200}>
            <div className="chamfer-card-right overflow-hidden">
              <img
                src={solarResidential}
                alt="Painéis solares em telhado residencial"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Card 2 — Sustentabilidade */}
      <section id="sobre" className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <ScrollCard direction="left" delay={100} className="md:order-2">
            <div className="chamfer-card-right bg-[hsl(var(--solar-green))] p-10 md:p-14 text-primary-foreground">
              <Leaf className="w-12 h-12 mb-6" />
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                Energia limpa. Planeta vivo.
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Cada painel solar instalado reduz a emissão de CO₂ em toneladas por ano.
                Diferente das fontes fósseis, a energia solar não polui, não faz barulho e
                não destrói ecossistemas.
              </p>
            </div>
          </ScrollCard>

          <ScrollCard direction="right" delay={200} className="md:order-1">
            <div className="chamfer-card overflow-hidden">
              <img
                src={solarNature}
                alt="Painéis solares com raios de sol na natureza"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Card 3 — Acessibilidade */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollCard>
            <div className="chamfer-card bg-secondary p-10 md:p-16 text-center">
              <Zap className="w-14 h-14 text-primary mx-auto mb-8" />
              <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight mb-6">
                O sol nasce para todos.{" "}
                <span className="text-gradient-solar">A energia também deveria.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                A energia solar já é a fonte de energia mais barata do mundo. Programas de
                incentivo, financiamento acessível e a queda no preço dos equipamentos estão
                democratizando o acesso à energia limpa no Brasil.
              </p>

              <div className="grid grid-cols-3 gap-6 mt-10">
                {[
                  { value: "2 milhões+", label: "Sistemas instalados no Brasil" },
                  { value: "R$ 200 bi", label: "Investidos desde 2012" },
                  { value: "40 GW", label: "De capacidade instalada" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-black text-gradient-solar">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* CTA Pesquisa */}
      <section id="pesquisa" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollCard>
            <div className="chamfer-card bg-primary p-12 md:p-20">
              <Sun className="w-16 h-16 text-primary-foreground mx-auto mb-8 animate-spin" style={{ animationDuration: '8s' }} />
              <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-6">
                Participe da nossa pesquisa
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
                Sua opinião é essencial. Ajude-nos a entender como as pessoas enxergam a
                energia solar e como podemos promovê-la juntos.
              </p>
              <a
                href="#"
                className="inline-block chamfer-card-sm bg-primary-foreground text-primary font-bold text-lg px-10 py-4 hover:scale-105 transition-transform duration-300"
              >
                Responder pesquisa →
              </a>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
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
