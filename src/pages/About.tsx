import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Heart, Users } from "lucide-react";

const About = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />

      <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Lado esquerdo: placeholder da imagem */}
              <div className="space-y-4">
                <div className="aspect-square w-full bg-white rounded-lg border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-center p-8 shadow-md">
                  <Users className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">Foto do grupo</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">(em breve)</p>
                </div>
                <p className="text-center text-sm text-muted-foreground italic">
                  Aqui vai entrar a nossa foto oficial – os responsáveis por este projeto.
                </p>
              </div>

              {/* Lado direito: texto sobre nós */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight">
                  Quem está por trás{" "}
                  <span className="text-gradient-solar">dessa ideia</span>
                </h1>

                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Somos um grupo de estudantes da <span className="font-bold text-foreground">Universidade Feevale</span>, unidos pelo propósito de transformar conhecimento em ação prática. Este projeto nasceu dentro da disciplina <span className="font-bold text-foreground">"Projeto Aplicado à Sociedade 2 – Intervenção"</span>, onde a gente aprendeu que a melhor forma de ensinar é mostrando caminhos possíveis.
                  </p>
                  <p>
                    E qual caminho é esse? A <span className="font-bold text-foreground">energia solar</span>, claro! Percebemos que ainda existe uma cortina de desinformação pairando sobre o assunto – muita gente acha que é caro, complicado ou coisa de futuro distante. Mas a verdade é que hoje a tecnologia solar está <span className="font-bold text-foreground">mais acessível, mais barata e mais durável</span> do que nunca. O que queremos fazer é justamente derrubar esses mitos, uma conversa de cada vez.
                  </p>
                  <p>
                    Porque quando uma família entende que pode reduzir a conta de luz em até 95%, que o investimento se paga em poucos anos e que o equipamento dura mais de 25 anos, a energia solar deixa de ser um sonho e vira <span className="font-bold text-foreground">planejamento real</span>. Mais dinheiro no bolso, mais conforto em casa, e um futuro melhor para o planeta. É disso que a gente gosta.
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 my-4">
                    <p className="italic text-foreground">
                      "Acreditamos que informação de qualidade é o primeiro passo para mudar hábitos. E quando a mudança ainda gera economia e sustentabilidade, todo mundo sai ganhando."
                    </p>
                  </div>
                  <p>
                    Por isso, se você está aqui e topou participar da nossa pesquisa, saiba que <span className="font-bold text-foreground">nosso muito obrigado</span>! Cada resposta, cada minutinho dedicado a preencher os formulários e ler nossos cards ajuda a gente a calibrar o projeto, entender o que o público realmente precisa saber e, no final, levar conteúdo cada vez mais útil para mais pessoas. Você é parte da solução.
                  </p>
                  <p className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <span className="font-medium">Vamos juntos? Acompanhe nossas próximas etapas e compartilhe a ideia.</span>
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