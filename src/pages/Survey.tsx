import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useMask } from "@/hooks/useMask";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type SurveyStep = "intro" | "form1" | "content1" | "content2" | "form2" | "finished";

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

const emptyFormData: FormData = {
  name: "",
  residents: "",
  email: "",
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
  q6: "",
};

const formQuestions = [
  {
    name: "q1",
    title:
      "1. Se fosse implantar na sua residência, qual é a expectativa de investimento inicial baseado no seu conhecimento atual?",
    options: ["Até R$10.000", "De R$10.000 a R$20.000", "De R$20.000 a R$30.000", "Acima de R$30.000", "Não tenho noção."],
  },
  {
    name: "q2",
    title: "2. Em quantos anos você imagina que o investimento em energia solar retornaria?",
    options: ["Até 2 anos", "De 3 a 5 anos", "De 6 a 10 anos", "Mais de 10 anos", "Não tenho noção."],
  },
  {
    name: "q3",
    title: "3. Você sabe quanto economizaria na conta de luz após instalar energia solar?",
    options: ["Até 30%", "De 30% a 60%", "De 60% a 90%", "Mais de 90%"],
  },
  {
    name: "q4",
    title: "4. Quantos kg de CO₂ você acredita que deixaria de emitir ao utilizar energia solar?",
    options: ["Menos de 500 kg/ano", "De 500 a 1.000 kg/ano", "De 1.000 a 3.000 kg/ano", "Mais de 3.000 kg/ano"],
  },
  {
    name: "q5",
    title: "5. Você já considerou instalar energia solar na sua residência?",
    options: ["Sim", "Não"],
  },
  {
    name: "q6",
    title: "6. O que você considera como maior dificuldade para investir em energia solar?",
    options: ["Alto custo inicial", "Falta de informação", "Burocracia", "Espaço no imóvel"],
  },
] as const;

const stepOrder: SurveyStep[] = ["intro", "form1", "content1", "content2", "form2", "finished"];

const isFormComplete = (data: FormData, includeIdentityFields = true) => {
  const values = includeIdentityFields
    ? Object.values(data)
    : [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6];

  return values.every((value) => value.trim().length > 0);
};

const Survey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { numberMask } = useMask();
  const [step, setStep] = useState<SurveyStep>("intro");
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [postFormData, setPostFormData] = useState<FormData>(emptyFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStep("intro");
    setErrorMessage("");
  }, [location.key]);

  useEffect(() => {
    const resetSurvey = () => {
      setStep("intro");
      setErrorMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("reset-survey", resetSurvey);
    return () => window.removeEventListener("reset-survey", resetSurvey);
  }, []);

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

  const goToStep = (targetStep: SurveyStep) => {
    setErrorMessage("");
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(step);
    goToStep(stepOrder[Math.max(currentIndex - 1, 0)]);
  };

  const handleNext = () => {
    if (step === "form1" && !isFormComplete(formData)) {
      setErrorMessage("Preencha o formulário 1 antes de avançar.");
      return;
    }

    if (step === "form2" && !isFormComplete(postFormData, false)) {
      setErrorMessage("Preencha o formulário 2 antes de finalizar.");
      return;
    }

    const currentIndex = stepOrder.indexOf(step);
    goToStep(stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)]);
  };

  const handleFormChange =
    (form: "pre" | "post") => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.target;
      const finalValue = name === "residents" ? numberMask(value) : value;
      const setter = form === "pre" ? setFormData : setPostFormData;

      setter((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? value : "") : finalValue,
      }));
    };

  const renderNavButtons = (nextLabel = "Avançar") => (
    <div className="animate-text pt-8 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-between">
      <button
        type="button"
        onClick={handleBack}
        className="relative text-base md:text-lg font-bold px-6 md:px-8 py-3 md:py-4 bg-muted text-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
      >
        <ChevronLeft className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Voltar</span>
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="relative text-base md:text-lg font-bold px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
      >
        <span className="relative z-10">{nextLabel}</span>
        <ChevronRight className="w-5 h-5 relative z-10" />
        <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      </button>
    </div>
  );

  const renderForm = (title: string, data: FormData, form: "pre" | "post") => (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
      <div className="max-w-4xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="animate-text mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2">
              {title}
            </h2>
            <div className="h-1 w-20 bg-primary" />
          </div>

          <form className="space-y-8">
            {form === "pre" && (
              <div className="space-y-6">
                <div className="animate-text">
                  <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                    Qual é o seu nome?
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleFormChange(form)}
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
                    value={data.residents}
                    onChange={handleFormChange(form)}
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
                    value={data.email}
                    onChange={handleFormChange(form)}
                    placeholder="Digite seu e-mail"
                    className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-8 border-t border-border pt-8">
              {formQuestions.map((question) => (
                <div className="animate-text" key={question.name}>
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                    {question.title}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name={question.name}
                          value={option}
                          checked={data[question.name] === option}
                          onChange={handleFormChange(form)}
                          className="w-5 h-5 rounded border border-primary cursor-pointer"
                        />
                        <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {errorMessage && (
              <p className="animate-text text-sm text-destructive font-semibold">
                {errorMessage}
              </p>
            )}

            {renderNavButtons(form === "post" ? "Finalizar" : "Avançar")}
          </form>
        </div>
      </div>
    </section>
  );

  const renderContent = (title: string) => (
    <section
      ref={contentRef}
      className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24"
    >
      <div className="max-w-4xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="space-y-8">
            <div className="animate-text">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-6">
                {title}
              </h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae
                  turpis at ipsum gravida facilisis. Cras sed arcu ac libero tempor
                  posuere sed vitae nibh.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames ac turpis
                  egestas.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  potenti. Donec luctus, justo vitae fermentum luctus, ipsum neque
                  consequat libero, sed facilisis lorem neque non erat.
                </p>
              </div>
            </div>

            {renderNavButtons()}
          </div>
        </div>
      </div>
    </section>
  );

  const renderEnvironmentalContent = () => (
    <section
      ref={contentRef}
      className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24"
    >
      <div className="max-w-5xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="space-y-8">
            <div className="animate-text space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                Tela 1
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-tight">
                Foco no planeta: impacto ambiental e legado
              </h2>
              <p className="text-lg md:text-2xl font-bold text-gradient-solar">
                Sua casa pode ajudar a mudar o clima.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Redução real de CO₂
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  350 kg/mês
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Um sistema residencial médio, perto de 3 kWp, pode evitar cerca de 350 kg de
                  CO₂ por mês. Em um ano, isso passa de 3.000 kg de CO₂ que deixam de ir para a
                  atmosfera.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Energia que não consome água
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  8 L a cada 100 kWh
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  A geração solar não usa água no processo. Como referência, cada 100 kWh gerados
                  pelo telhado ajudam a economizar cerca de 8 litros de água que poderiam ser
                  usados na geração convencional.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Geração perto de quem usa
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  Menos perdas
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Quando a energia nasce no próprio telhado, ela percorre um caminho menor até o
                  consumo. Isso ajuda a reduzir perdas na transmissão e alivia a rede nos horários
                  em que muita gente está usando energia ao mesmo tempo.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Limpa, silenciosa e sem ocupar solo
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  0 ruído
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  O sistema não faz barulho, aproveita uma área que já existe e ainda ajuda a
                  proteger o telhado contra sol forte, chuva e calor direto.
                </p>
              </div>
            </div>

            <div className="animate-text bg-primary/10 border border-primary/25 p-5 md:p-6">
              <p className="text-base md:text-xl font-bold text-foreground leading-relaxed">
                Cada telhado solar funciona como uma pequena usina limpa e silenciosa. E quando
                milhões de telhados fazem isso juntos, eles ajudam a transformar a matriz elétrica
                do país, que já chegou a 88% de fontes renováveis em 2024.
              </p>
            </div>



            {renderNavButtons()}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="snap-container">
      <Navbar />
      <ScrollToTop />

      {step === "intro" && (
        <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
          <div className="max-w-4xl w-full mx-auto">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="space-y-6">
                <div className="animate-text">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                    Obrigado por se disponibilizar{" "}
                    <span className="text-gradient-solar">a participar</span> de nosso projeto
                  </h1>
                </div>

                <div className="animate-text">
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Por favor, tenha uma
                    <span className="font-bold text-foreground"> conta de energia em mãos</span> para
                    ter uma melhor experiência.
                  </p>
                </div>

                <div className="animate-text space-y-4 bg-primary/5 border border-primary/20 p-6 md:p-8">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    A seguir, inicialmente, você encontrará{" "}
                    <span className="font-bold text-foreground">uma trilha</span>,
                    contendo um formulário para avaliar{" "}
                    <span className="font-bold text-foreground">seu conhecimento atual</span>,
                    um <span className="font-bold text-foreground">conteúdo de aprendizado</span>,
                    a <span className="font-bold text-foreground">calculadora solar</span> para gerar sua
                    possibilidade de economia, e por fim um{" "}
                    <span className="font-bold text-foreground">formulário</span> para verificarmos o
                    quanto você aprendeu com nossa trilha.
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Para o uso da calculadora é necessário saber o seu consumo mensal baseado na
                    última fatura, ou preferencialmente na média das 3 últimas.
                  </p>
                </div>

                <div className="animate-text">
                  <p className="text-lg md:text-xl font-bold text-gradient-solar">
                    Todo o processo leva aproximadamente entre 5 e 10 minutos do seu tempo.
                  </p>
                </div>

                <div className="animate-text pt-4 flex justify-center">
                  <button
                    onClick={() => goToStep("form1")}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 flex items-center gap-3"
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

      {step === "form1" && renderForm("FORMULÁRIO 1 - PRÉ-ESTUDO", formData, "pre")}
      {step === "content1" && renderEnvironmentalContent()}
      {step === "content2" && renderContent("Conteúdo informativo 2")}
      {step === "form2" && renderForm("FORMULÁRIO 2 - PÓS-ESTUDO", postFormData, "post")}

      {step === "finished" && (
        <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
          <div className="max-w-4xl w-full mx-auto">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="space-y-8 text-center">
                <div className="animate-text">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                    Teste <span className="text-gradient-solar">finalizado!</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-black text-foreground mt-6 leading-relaxed">
                    Obrigado por disponibilizar seu tempo e contribuir com
                    <span className="text-primary"> dados valiosos</span> para nossa pesquisa sobre{" "}
                    <span className="text-gradient-solar">energia solar</span>.
                  </p>
                </div>

                <div className="animate-text pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
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
