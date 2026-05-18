import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Heart } from "lucide-react";

const About = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />

      <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="chamfer-card bg-secondary border border-border p-6 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-center">
              <figure className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-border bg-background shadow-xl">
                  <img
                    src="/foto_sobre.jpg"
                    alt="Grupo de estudantes responsável pelo projeto Use Mais Energia Solar"
                    className="h-full w-full aspect-[4/3] sm:aspect-[16/11] object-cover object-center"
                    loading="eager"
                  />
                </div>
                <figcaption className="text-center text-sm text-muted-foreground">
                  Grupo responsável pelo projeto acadêmico de difusão da energia solar.
                </figcaption>
              </figure>

              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight">
                  Quem está por trás{" "}
                  <span className="text-gradient-solar">dessa ideia</span>
                </h1>

                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Somos estudantes da <span className="font-bold text-foreground">Universidade Feevale</span> e
                    criamos este projeto dentro da disciplina{" "}
                    <span className="font-bold text-foreground">Projeto Aplicado à Sociedade 2 - Intervenção</span>.
                    A proposta é aproximar a energia solar do cotidiano das pessoas, com informação simples,
                    cálculos claros e uma pesquisa que ajude a entender as principais dúvidas sobre o tema.
                  </p>

                  <p>
                    A energia solar ainda parece distante para muita gente. Algumas pessoas imaginam que é cara,
                    complicada ou viável apenas em grandes projetos. Nosso objetivo é mostrar, com exemplos
                    práticos, que essa tecnologia já pode fazer parte do planejamento de muitas famílias.
                  </p>

                  <p>
                    Quando alguém entende quanto pode economizar, em quanto tempo o investimento tende a se pagar
                    e qual impacto ambiental pode ser evitado, a decisão deixa de ser abstrata. Ela passa a ser
                    uma conversa real sobre economia, conforto e sustentabilidade.
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary p-4 my-4">
                    <p className="italic text-foreground">
                      "Acreditamos que informação de qualidade é o primeiro passo para transformar curiosidade em
                      escolha consciente."
                    </p>
                  </div>

                  <p>
                    Se você chegou até aqui e participou da pesquisa, nosso muito obrigado. Cada resposta ajuda a
                    melhorar o projeto, ajustar a linguagem e levar conteúdo mais útil para quem ainda está
                    conhecendo a energia solar.
                  </p>

                  <p className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
                    <span className="font-medium">Vamos juntos espalhar essa ideia?</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
