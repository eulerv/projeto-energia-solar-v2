import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useMask } from "@/hooks/useMask";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type SurveyStep = "intro" | "form" | "finished";

interface FormData {
  name: string;
  residents: string;
  email: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

const Survey = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SurveyStep>("intro");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    residents: "",
    email: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
  });

  const { numberMask } = useMask();
  const introRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef<HTMLDivElement>(null);

  // Animate text elements on mount/step change
  useEffect(() => {
    const textElements = document.querySelectorAll(".animate-text");
    gsap.killTweensOf(textElements);

    gsap.fromTo(
      textElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, [step]);

  const handleStartSurvey = () => {
    setStep("form");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    // Apply number mask to residents field
    if (name === "residents") {
      finalValue = numberMask(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? value : "") : finalValue,
    }));
  };

  const handleFinalizeSurvey = () => {
    setStep("finished");
  };

  return (
    <div className="snap-container">
      <Navbar />
      <ScrollToTop />

      {/* INTRO SECTION */}
      {step === "intro" && (
        <section
          ref={introRef}
          className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12"
        >
          <div className="max-w-4xl w-full mx-auto">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="space-y-6">
                <div className="animate-text">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                    Obrigado por se disponibilizar{" "}
                    <span className="text-gradient-solar">a participar</span> de
                    nosso projeto <span className="text-primary">😊</span>
                  </h1>
                </div>

                <div className="animate-text">
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Por favor, tenha uma
                    <span className="font-bold text-foreground"> conta de energia em mãos</span> para
                    ter uma melhor experiência.
                  </p>
                </div>

                <div className="animate-text space-y-4 bg-primary/5 border border-primary/20 p-6 md:p-8 chamfer-card">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    A seguir, inicialmente, você encontrará{" "}
                    <span className="font-bold text-foreground">uma trilha</span>.
                    contendo um formulário para avaliar{" "}
                    <span className="font-bold text-foreground">seu conhecimento atual</span>
                    , um {" "}
                    <span className="font-bold text-foreground">conteúdo de aprendizado</span>
                    , a {" "}
                    <span className="font-bold text-foreground">calculadora solar</span>
                    para gerar sua possibilidade de economia, e por fim um {" "}
                    <span className="font-bold text-foreground">formulário </span>
                    para verificarmos o quanto você aprendeu com nossa trilha!{" "}
                  </p>
                  <p> Mas calma, pensamos tudo para seja direto e rápido, com as informações mais relevantes para conscientização
                    <span className="text-primary">😊</span>
                  </p>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Para o uso da calculadora é necessário saber o seu consumo mensal baseado na última fatura, ou preferencialmente na média das 3 últimas.
                  </p>
                </div>

                <div className="animate-text">
                  <p className="text-lg md:text-xl font-bold text-gradient-solar">
                    ⏱️ Todo o processo leva aproximadamente entre 5 e 10 minutos do seu tempo, e nos ajuda muito a realizar esse projeto <span className="text-primary">🙌</span>
                  </p>
                </div>

                <div className="animate-text pt-4">
                  <button
                    onClick={handleStartSurvey}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105 flex items-center gap-3"
                  >
                    <span className="relative z-10">Iniciar</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                    <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FORM SECTION */}
      {step === "form" && (
        <section
          ref={formRef}
          className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12"
        >
          <div className="max-w-4xl w-full mx-auto">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="animate-text mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2">
                  FORMULÁRIO 1 - PRÉ-ESTUDO
                </h2>
                <div className="h-1 w-20 bg-gradient-solar"></div>
              </div>

              <form className="space-y-8">
                {/* Text Fields */}
                <div className="space-y-6">
                  <div className="animate-text">
                    <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                      Qual é o seu nome?
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Digite seu nome"
                      className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="animate-text">
                    <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                      Quantas pessoas moram na sua residência (incluindo você mesmo)?
                    </label>
                    <input
                      type="number"
                      name="residents"
                      value={formData.residents}
                      onChange={handleFormChange}
                      placeholder="Digite o número"
                      className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="animate-text">
                    <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                      Qual é o seu e-mail?
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Use o mesmo no 1º e 2º formulários para confirmar sua identidade
                    </p>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Digite seu e-mail"
                      className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Checkbox Questions */}
                <div className="space-y-8 border-t border-border pt-8">
                  {/* Q1 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      1. Se fosse implantar na sua residência, qual é a expectativa de investimento inicial baseado no seu conhecimento atual?
                    </h3>
                    <div className="space-y-3">
                      {["Até R$10.000", "De R$10.000 a R$20.000", "De R$20.000 a R$30.000", "Acima de R$30.000", "Não tenho noção."].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q1"
                            value={option}
                            checked={formData.q1 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      2. Em quantos anos você imagina que o investimento em energia solar retornaria?
                    </h3>
                    <div className="space-y-3">
                      {["Até 2 anos", "De 3 a 5 anos", "De 6 a 10 anos", "Mais de 10 anos", "Não tenho noção."].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q2"
                            value={option}
                            checked={formData.q2 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      3. Você sabe quanto economizaria na conta de luz após instalar energia solar?
                    </h3>
                    <div className="space-y-3">
                      {["Até 30%", "De 30% a 60%", "De 60% a 90%", "Mais de 90%"].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q3"
                            value={option}
                            checked={formData.q3 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      4. Quantos kg de CO₂ você acredita que deixaria de emitir ao utilizar energia solar?
                    </h3>
                    <div className="space-y-3">
                      {["Menos de 500 kg/ano", "De 500 a 1.000 kg/ano", "De 1.000 a 3.000 kg/ano", "Mais de 3.000 kg/ano"].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q4"
                            value={option}
                            checked={formData.q4 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q5 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      5. Você já considerou instalar energia solar na sua residência?
                    </h3>
                    <div className="space-y-3">
                      {["Sim", "Não"].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q5"
                            value={option}
                            checked={formData.q5 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Q6 */}
                  <div className="animate-text">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                      6. O que você considera como maior dificuldade para investir em energia solar?
                    </h3>
                    <div className="space-y-3">
                      {["Alto custo inicial", "Falta de informação", "Burocracia", "Espaço no imóvel"].map((option, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="q6"
                            value={option}
                            checked={formData.q6 === option}
                            onChange={handleFormChange}
                            className="w-5 h-5 rounded border border-primary cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="animate-text pt-8 border-t border-border">
                  <button
                    type="button"
                    onClick={handleFinalizeSurvey}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start"
                  >
                    <span className="relative z-10">Finalizar</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                    <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* FINISHED SECTION */}
      {step === "finished" && (
        <section
          ref={finishedRef}
          className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12"
        >
          <div className="max-w-4xl w-full mx-auto">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="space-y-8 text-center">
                <div className="animate-text">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                    Teste{" "}
                    <span className="text-gradient-solar">finalizado!</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-black text-foreground mt-6 leading-relaxed">
                    Obrigado por{" "}
                    <span className="text-gradient-solar">disponibilizar seu tempo</span> e contribuir com
                    <span className="text-primary"> dados valiosos</span> para nossa pesquisa sobre{" "}
                    <span className="text-gradient-solar">energia solar</span>.
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">
                    Sua participação nos ajuda a entender melhor as percepções e necessidades da
                    população em relação às energias renováveis e sustentáveis.
                  </p>
                </div>

                <div className="animate-text">
                  <div className="bg-white dark:bg-slate-50 min-h-[400px] md:min-h-[500px] rounded-lg" />
                </div>

                <div className="animate-text pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground chamfer-card-sm overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
                  >
                    <span className="relative z-10">Voltar para Home</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                    <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Survey;
