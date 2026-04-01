import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sun, Leaf, TrendingDown, Zap, Battery, DollarSign } from "lucide-react";
import solarHero from "@/assets/solar-hero.jpg";
import solarInstall from "@/assets/solar-install.jpg";
import solarFamily from "@/assets/solar-family.jpg";
import solarHands from "@/assets/solar-hands.jpg";

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
      <ScrollToTop />

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

      {/* Card 1 — Economia: card de texto maior + imagem menor */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-stretch">
          <ScrollCard direction="left" className="md:col-span-3">
            <div className="chamfer-card bg-primary p-8 md:p-12 lg:p-14 text-primary-foreground h-full">
              <TrendingDown className="w-10 h-10 md:w-12 md:h-12 mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
                Economize até 95% na sua conta de luz.
              </h2>
              <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed">
                O investimento em energia solar se paga em poucos anos e gera economia por
                décadas. Uma energia renovável e limpa, que agora se consolida como realidade no Brasil.
              </p>
            </div>
          </ScrollCard>

          <ScrollCard direction="right" delay={200} className="md:col-span-2">
            <div className="chamfer-card-right overflow-hidden h-full">
              <img
                src={solarInstall}
                alt="Trabalhador instalando painéis solares"
                className="w-full h-[300px] md:h-full object-cover"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Card 2 — Sustentabilidade: 1 card grande à esquerda + 3 menores à direita */}
      <section id="sobre" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Card grande com imagem */}
          <ScrollCard direction="left" className="md:col-span-5 md:row-span-2">
            <div className="chamfer-card overflow-hidden h-full">
              <img
                src={solarFamily}
                alt="Família em frente a casa com energia solar"
                className="w-full h-[350px] md:h-full object-cover"
                loading="lazy"
                width={600}
                height={800}
              />
            </div>
          </ScrollCard>

          {/* Card verde principal */}
          <ScrollCard direction="right" delay={100} className="md:col-span-7">
            <div className="chamfer-card-right bg-[hsl(var(--solar-green))] p-8 md:p-10 text-primary-foreground h-full">
              <Leaf className="w-10 h-10 mb-4" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-4">
                Energia limpa. Planeta vivo.
              </h2>
              <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed">
                Cada painel solar instalado reduz a emissão de CO₂ em toneladas por ano.
                Diferente das fontes fósseis, a energia solar não polui, não faz barulho e
                não destrói ecossistemas.
              </p>
            </div>
          </ScrollCard>

          {/* 2 cards pequenos lado a lado */}
          <ScrollCard direction="right" delay={250} className="md:col-span-4">
            <div className="chamfer-card-sm bg-secondary p-6 md:p-8 h-full">
              <Battery className="w-8 h-8 text-primary mb-3" />
              <p className="text-lg md:text-xl font-bold text-foreground mb-2">25+ anos</p>
              <p className="text-sm text-muted-foreground">Vida útil média de um sistema solar residencial</p>
            </div>
          </ScrollCard>

          <ScrollCard direction="right" delay={400} className="md:col-span-3">
            <div className="chamfer-card-sm bg-secondary p-6 md:p-8 h-full">
              <DollarSign className="w-8 h-8 text-[hsl(var(--solar-green))] mb-3" />
              <p className="text-lg md:text-xl font-bold text-foreground mb-2">4-6 anos</p>
              <p className="text-sm text-muted-foreground">Retorno do investimento</p>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Card 3 — Acessibilidade */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <ScrollCard direction="left">
            <div className="chamfer-card bg-secondary p-8 md:p-12 lg:p-16">
              <Zap className="w-12 h-12 md:w-14 md:h-14 text-primary mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
                Faça parte desse movimento, a energia solar é para todos.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Uma tecnologia acessível, cada vez mais barata e durável, financiamento acessível, energia limpa sem emissão de carbono. O futuro é agora.
              </p>
            </div>
          </ScrollCard>

          <ScrollCard direction="right" delay={200}>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="chamfer-card-sm overflow-hidden">
                <img
                  src={solarHands}
                  alt="Mãos segurando painel solar"
                  className="w-full h-[200px] md:h-[240px] object-cover"
                  loading="lazy"
                  width={600}
                  height={600}
                />
              </div>
              <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-6 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-black text-gradient-solar">2 milhões+</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Sistemas instalados no Brasil</p>
              </div>
              <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-6 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-black text-gradient-solar">R$ 200 bi</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Investidos desde 2012</p>
              </div>
              <div className="chamfer-card-sm bg-primary/10 border border-primary/20 p-6 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-black text-gradient-solar">40 GW</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">De capacidade instalada</p>
              </div>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* CTA Pesquisa */}
      <section id="pesquisa" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto max-w-5xl text-center">
          <ScrollCard>
            <div className="chamfer-card bg-primary p-10 md:p-16 lg:p-20">
              <Sun className="w-14 h-14 md:w-16 md:h-16 text-primary-foreground mx-auto mb-8 animate-spin" style={{ animationDuration: '8s' }} />
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-6">
                Participe da nossa pesquisa
              </h2>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl mx-auto mb-10">
                Sua opinião é essencial. Ajude-nos a entender como as pessoas enxergam a
                energia solar e como podemos promovê-la juntos.
              </p>
              <a
                href="#"
                className="inline-block chamfer-card-sm bg-primary-foreground text-primary font-bold text-base md:text-lg px-8 md:px-10 py-4 hover:scale-105 transition-transform duration-300"
              >
                Responder pesquisa →
              </a>
            </div>
          </ScrollCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
