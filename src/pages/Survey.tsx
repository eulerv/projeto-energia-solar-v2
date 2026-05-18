import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { useMask } from "@/hooks/useMask";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import gsap from "gsap";
import { BarChart3, Calculator, ChevronLeft, ChevronRight, DollarSign, Leaf, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type SurveyStep =
  | "intro"
  | "form1"
  | "process"
  | "calculator"
  | "content1"
  | "content2"
  | "form2"
  | "finished";

interface FormData {
  name: string;
  residents: string;
  email: string;
  city: string;
  income: string;
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
  city: "",
  income: "",
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
  q6: "",
};

const preFormQuestions = [
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
    title: "3. Quanto você acredita que economizaria na conta de luz após instalar energia solar?",
    options: ["Até 30%", "De 30% a 60%", "De 60% a 90%", "Mais de 90%", "Não tenho noção."],
  },
  {
    name: "q4",
    title: "4. Quanto você imagina que o Brasil utiliza de energias renováveis atualmente?",
    options: ["Entre 10% e 20%", "De 20% a 40%", "De 40% a 70%", "Mais de 70%", "Não tenho noção."],
  },
  {
    name: "q5",
    title: "5. Você já considerou instalar energia solar na sua residência?",
    options: ["Sim", "Não", "Já possuo energia solar", "Não tenho certeza"],
  },
  {
    name: "q6",
    title: "6. O que você considera ser a maior dificuldade para investir em energia solar?",
    options: ["Alto custo inicial", "Falta de acesso a informação", "Burocracia, seja com legislação ou em financiamento", "Espaço no imóvel(área de telhado)", "Não sei dizer"],
  },
] as const;

const postFormQuestions = [
  {
    name: "q1",
    title: "1. Um sistema residencial médio de energia solar pode evitar quantos metros cúbicos (m³) de CO₂ por mês?",
    options: ["50 m³ por mês", "100 m³ por mês", "178 m³ por mês", "250 m³ por mês"],
  },
  {
    name: "q2",
    title: "2. De acordo com o conteúdo, qual a porcentagem de fontes renováveis na matriz elétrica brasileira em 2024?",
    options: ["50%", "70%", "88%", "99%"],
  },
  {
    name: "q3",
    title: "3. Até quanto a conta de luz pode ser reduzida com a instalação de energia solar?",
    options: ["Até 50%", "Até 70%", "Até 95%", "100% (zerar a conta)"],
  },
  {
    name: "q4",
    title: "4. Quantos empregos o setor solar já gerou no mundo (aproximadamente)?",
    options: ["500 mil", "1 milhão", "1,5 milhão", "2 milhões", "Não tenho noção."],
  },
  {
    name: "q5",
    title: "5. Após passar pela experiência, sabendo das informações apresentadas e do seu resultado na calculadora, você teve diria que teve um impacto no geral:",
    options: ["Negativo", "Mediano mas insuficiente", "Mediano e suficiente", "Além das expectativas"],
  },
  {
    name: "q6",
    title: "6. Marque a frase que melhor define sua percepção no momento:",
    options: ["Imaginei números superiores, não supriu minhas expectativas", "Achei o conteúdo interessante e explicativo, vou refletir", "Tenho boas chances de entrar em contato para solicitar orçamento"],
  },
] as const;

const stepOrder: SurveyStep[] = [
  "intro",
  "form1",
  "process",
  "calculator",
  "content1",
  "content2",
  "form2",
  "finished",
];

const stepLabels: Record<SurveyStep, string> = {
  intro: "Início",
  form1: "Formulário 1",
  process: "Como funciona",
  calculator: "Calculadora",
  content1: "Conteúdo 1",
  content2: "Conteúdo 2",
  form2: "Formulário 2",
  finished: "Resultado",
};

const incomeOptions = [
  "Menos de 1 salário mínimo",
  "De 1 a 2 salários mínimos",
  "De 3 a 5 salários mínimos",
  "De 5 a 8 salários mínimos",
  "Mais que 8 salários mínimos",
] as const;
const DAYS_PER_MONTH = 30;
const SOLAR_IRRADIATION_RATE = 4.32;
const SAFETY_MARGIN = 0.75;
const AVERAGE_TARIFF_BRL_PER_KWH = 0.822;
const GRID_EMISSION_KG_CO2_PER_KWH = 0.0289;
const KG_CO2_PER_TREE_PER_YEAR = 60;
const SYSTEM_LIFETIME_YEARS = 25;

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

const isFormComplete = (data: FormData, includeIdentityFields = true) => {
  const values = includeIdentityFields
    ? Object.values(data)
    : [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6];

  return values.every((value) => value.trim().length > 0);
};

const getStepError = (
  currentData: FormData,
  postData: FormData,
  hasCalculatorResult: boolean,
  targetStep: SurveyStep,
) => {
  const targetIndex = stepOrder.indexOf(targetStep);

  if (targetIndex > stepOrder.indexOf("form1") && !isFormComplete(currentData)) {
    return "Preencha o formulário 1 antes de avançar.";
  }

  if (targetIndex > stepOrder.indexOf("calculator") && !hasCalculatorResult) {
    return "Calcule seu potencial solar antes de avançar.";
  }

  if (targetIndex > stepOrder.indexOf("form2") && !isFormComplete(postData, false)) {
    return "Preencha o formulário 2 antes de finalizar.";
  }

  return "";
};

const Survey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { numberMask } = useMask();
  const [step, setStep] = useState<SurveyStep>("intro");
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [postFormData, setPostFormData] = useState<FormData>(emptyFormData);
  const [monthlyConsumption, setMonthlyConsumption] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const calculatorResult = useMemo(() => {
    const consumption = Number(monthlyConsumption.replace(",", "."));

    if (!Number.isFinite(consumption) || consumption <= 0) {
      return null;
    }

    const kwp = consumption / DAYS_PER_MONTH / SOLAR_IRRADIATION_RATE / SAFETY_MARGIN;
    const pricePerKwp = getPricePerKwp(kwp);
    const systemCost = kwp * pricePerKwp;
    const monthlySavings = consumption * AVERAGE_TARIFF_BRL_PER_KWH;
    const annualSavings = monthlySavings * 12;
    const paybackYears = systemCost / annualSavings;
    const avoidedCo2KgPerYear = consumption * 12 * GRID_EMISSION_KG_CO2_PER_KWH;
    const avoidedCo2KgLifetime = avoidedCo2KgPerYear * SYSTEM_LIFETIME_YEARS;
    const preservedTreesLifetime =
      avoidedCo2KgLifetime / KG_CO2_PER_TREE_PER_YEAR;

    return {
      annualSavings,
      avoidedCo2KgLifetime,
      avoidedCo2KgPerYear,
      kwp,
      monthlySavings,
      paybackYears,
      preservedTreesLifetime,
      pricePerKwp,
      systemCost,
    };
  }, [monthlyConsumption]);

  useEffect(() => {
    setStep("intro");
    setErrorMessage("");
  }, [location.key]);

  useEffect(() => {
    const resetSurvey = () => {
      setStep("intro");
      setErrorMessage("");
      setSurveySubmitted(false);
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

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [step]);

  const goToStep = (targetStep: SurveyStep) => {
    setErrorMessage("");
    setStep(targetStep);
  };

  const requestStepChange = async (targetStep: SurveyStep) => {
    if (isSubmittingSurvey) {
      return;
    }

    const targetIndex = stepOrder.indexOf(targetStep);
    const currentIndex = stepOrder.indexOf(step);
    const error = targetIndex > currentIndex
      ? getStepError(formData, postFormData, Boolean(calculatorResult), targetStep)
      : "";

    if (error) {
      if (targetIndex > stepOrder.indexOf("calculator") && !calculatorResult) {
        setHasCalculated(true);
      }

      setErrorMessage(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      targetIndex > stepOrder.indexOf("form2") &&
      targetIndex > currentIndex &&
      !surveySubmitted
    ) {
      const submitted = await submitSurveyResponse();

      if (!submitted) {
        return;
      }
    }

    goToStep(targetStep);
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(step);
    requestStepChange(stepOrder[Math.max(currentIndex - 1, 0)]);
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(step);
    const targetStep = stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)];
    requestStepChange(targetStep);
  };

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasCalculated(true);
    setErrorMessage("");
  };

  const submitSurveyResponse = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        "Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente do app.",
      );
      return false;
    }

    if (!calculatorResult) {
      setErrorMessage("Calcule seu potencial solar antes de finalizar.");
      return false;
    }

    const monthlyConsumptionKwh = Number(monthlyConsumption.replace(",", "."));
    const payload = {
      name: formData.name.trim(),
      residents: Number.parseInt(formData.residents, 10),
      email: formData.email.trim().toLowerCase(),
      city: formData.city.trim(),
      income: formData.income,
      pre_q1: formData.q1,
      pre_q2: formData.q2,
      pre_q3: formData.q3,
      pre_q4: formData.q4,
      pre_q5: formData.q5,
      pre_q6: formData.q6,
      monthly_consumption_kwh: monthlyConsumptionKwh,
      estimated_kwp: calculatorResult.kwp,
      estimated_system_cost_brl: calculatorResult.systemCost,
      estimated_monthly_savings_brl: calculatorResult.monthlySavings,
      estimated_annual_savings_brl: calculatorResult.annualSavings,
      estimated_payback_years: calculatorResult.paybackYears,
      estimated_avoided_co2_kg_lifetime: calculatorResult.avoidedCo2KgLifetime,
      estimated_trees_equivalent_lifetime: calculatorResult.preservedTreesLifetime,
      post_q1: postFormData.q1,
      post_q2: postFormData.q2,
      post_q3: postFormData.q3,
      post_q4: postFormData.q4,
      post_q5: postFormData.q5,
      post_q6: postFormData.q6,
    };

    console.groupCollapsed("[Supabase] Envio da pesquisa completa");
    console.info("Tabela:", "survey_responses");
    console.info("Payload:", payload);
    console.groupEnd();

    setIsSubmittingSurvey(true);

    try {
      const { error } = await supabase
        .from("survey_responses")
        .upsert(payload, { onConflict: "email" });

      if (error) {
        throw error;
      }

      setSurveySubmitted(true);
      console.info("[Supabase] Respostas salvas em survey_responses.");
      return true;
    } catch (error) {
      console.error("[Supabase] Falha ao salvar respostas:", error);
      setErrorMessage("Nao foi possivel salvar suas respostas. Confira a conexao e tente novamente.");
      return false;
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  const handleFormChange =
    (form: "pre" | "post") =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      const isCheckedInput = event.target instanceof HTMLInputElement && event.target.type === "checkbox";
      const finalValue = name === "residents" ? numberMask(value) : value;
      const setter = form === "pre" ? setFormData : setPostFormData;

      setter((prev) => ({
        ...prev,
        [name]: isCheckedInput ? (event.target.checked ? value : "") : finalValue,
      }));
    };

  const renderStepProgress = () => {
    const currentIndex = stepOrder.indexOf(step);

    return (
      <div className="animate-text pt-6">
        <div className="flex items-center gap-2" aria-label="Navegação da pesquisa">
          {stepOrder.map((item, index) => {
            const isActive = item === step;
            const isPast = index < currentIndex;

            return (
              <button
                key={item}
                type="button"
                onClick={() => requestStepChange(item)}
                className={`group flex min-w-0 flex-1 flex-col items-center gap-2 ${
                  index === 0 ? "" : ""
                }`}
                aria-label={`Ir para ${stepLabels[item]}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`h-2 w-full transition-colors duration-300 ${
                    isActive || isPast
                      ? "bg-primary"
                      : "bg-muted group-hover:bg-primary/50"
                  }`}
                />
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black transition-colors duration-300 ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isPast
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border bg-background text-muted-foreground group-hover:border-primary/60 group-hover:text-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="hidden text-center text-[11px] font-semibold text-muted-foreground md:block">
                  {stepLabels[item]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNavButtons = (nextLabel = "Avançar") => (
    <div className="pt-8 border-t border-border">
      <div className="animate-text flex flex-col sm:flex-row gap-3 sm:justify-between">
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
          disabled={isSubmittingSurvey}
          className="relative text-base md:text-lg font-bold px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 inline-flex items-center justify-center gap-3"
        >
          <span className="relative z-10">{nextLabel}</span>
          <ChevronRight className="w-5 h-5 relative z-10" />
          <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
      {renderStepProgress()}
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

                <div className="animate-text">
                  <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                    Em qual cidade você mora?
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={data.city}
                    onChange={handleFormChange(form)}
                    placeholder="Ex.: Novo Hamburgo"
                    className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="animate-text">
                  <label className="block text-sm md:text-base font-bold text-foreground mb-3">
                    Qual é o perfil de renda total da sua casa?
                  </label>
                  <select
                    name="income"
                    value={data.income}
                    onChange={handleFormChange(form)}
                    className="w-full px-4 py-3 md:py-4 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Selecione uma faixa</option>
                    {incomeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-8 border-t border-border pt-8">
              {(form === "pre" ? preFormQuestions : postFormQuestions).map((question) => (
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

            {form === "pre" && (
              <p className="animate-text text-xs md:text-sm text-muted-foreground leading-relaxed">
                Suas respostas serao salvas com o restante da pesquisa ao concluir a trilha.
              </p>
            )}

            {renderNavButtons(form === "post" && isSubmittingSurvey ? "Enviando..." : "Avançar")}
          </form>
        </div>
      </div>
    </section>
  );

  const renderProcessExplanation = () => (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
      <div className="max-w-4xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="space-y-8">
            <div className="animate-text space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                Próximas etapas
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-tight">
                Sobre a trilha
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Agora que passou pelo primeiro formulário, você vai acessar uma calculadora solar para estimar
                seu potencial de economia. Em seguida, verá duas telas rápidas com cards informativos
                sobre impacto ambiental, economia e acesso à energia. No fim, responderá o formulário 2
                para compararmos o conhecimento antes e depois da experiência.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="animate-text bg-background/70 border border-border p-5">
                <Calculator className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-black text-foreground mb-2">1. Calculadora</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Informe o consumo mensal em kWh para receber estimativas de sistema, economia e retorno.
                </p>
              </div>
              <div className="animate-text bg-background/70 border border-border p-5">
                <Leaf className="w-8 h-8 text-[hsl(var(--solar-green))] mb-4" />
                <h3 className="text-lg font-black text-foreground mb-2">2. Conteúdo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leia dois blocos curtos com dados que ajudam a interpretar os resultados da pesquisa.
                </p>
              </div>
              <div className="animate-text bg-background/70 border border-border p-5">
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-black text-foreground mb-2">3. Comparação</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O formulário final mostra se a trilha mudou a percepção sobre energia solar.
                </p>
              </div>
            </div>

            <div className="animate-text bg-primary/10 border border-primary/25 p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                O que esperar da experiência
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                Você pode avançar no seu ritmo, voltar para rever
                uma tela anterior e usar as etapas numeradas para acompanhar onde está. As estimativas da
                calculadora são aproximadas, mas muito próximas da realidade e ajudam a transformar o tema em algo mais concreto para cada caso.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="bg-background/70 border border-border p-4">
                  <span className="font-bold text-foreground">Seu consumo:</span> use a conta de luz ou uma
                  estimativa mensal em kWh para preencher a calculadora.
                </div>
                <div className="bg-background/70 border border-border p-4">
                  <span className="font-bold text-foreground">Economia:</span> veja uma projeção simples de
                  quanto a energia solar pode representar no orçamento.
                </div>

              </div>
            </div>

            {renderNavButtons("Ir para calculadora")}
          </div>
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
                  178 m³/mês
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Um sistema residencial médio, perto de 3 kWp, pode evitar cerca de 178 m³ de
                  CO₂ por mês. Em um ano, isso passa de 1.700 m³ de CO₂ que deixam de ir para a
                  atmosfera.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Limpa, silenciosa e muitas vezes sem ocupar espaço
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  Zero ruído
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  O sistema não faz barulho, pode aproveitar uma área disponível nos telhados e ainda ajuda a
                  protege-lo contra sol forte, chuva e calor direto.
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
                  Energia que não consome água
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  8l a cada 100 kWh
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  A geração solar não usa água na captação. Além da geração hidrelétrica que utiliza diretamente a água para
                  mover as turbinas, outras fontes como termelétricas e nucleares usam calor para gerar vapor, que por sua vez movimenta as turbinas.
                  Esse processo de geração de vapor e resfriamento consome uma quantidade significativa de água. Como referência, cada 100 kWh gerados
                  pelo telhado deixam de utilizar em média 8 litros de água usados na geração convencional.
                </p>
              </div>
            </div>

            <div className="animate-text bg-primary/10 border border-primary/25 p-5 md:p-6">
              <p className="text-base md:text-xl font-bold text-foreground leading-relaxed">
                Cada telhado solar funciona como uma pequena usina limpa e silenciosa. E quando
                milhões de telhados fazem isso juntos, eles ajudam a transformar a matriz elétrica
                do país, que já chegou a 88% de fontes renováveis na última apuração em 2024.
              </p>
            </div>



            {renderNavButtons()}
          </div>
        </div>
      </div>
    </section>
  );

  const renderEnvironmentalContent2 = () => (
    <section
      ref={contentRef}
      className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24"
    >
      <div className="max-w-5xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="space-y-8">
            <div className="animate-text space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                Tela 2
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-tight">
                Economia que vira dignidade – energia solar para todos
              </h2>
              <p className="text-lg md:text-2xl font-bold text-gradient-solar">
                Menos gasto, mais futuro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Economia real na conta
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  Até 95% de redução
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Quem instala energia solar pode reduzir a conta de luz em até 95% em muitos casos. A economia mensal sobra para outras coisas: comida, remédio, material escolar.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Energia onde a rede não chega
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  +2 milhões de brasileiros
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  No Brasil, mais de 2 milhões de pessoas vivem sem acesso à rede elétrica. A energia solar isolada (off-grid) leva luz para comunidades ribeirinhas, quilombolas e regiões remotas pela primeira vez.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Geração de empregos locais
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  1,5 milhão de empregos (mundo)
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  O setor solar já é um dos que mais criam trabalho – desde instaladores até vendedores e técnicos. Muitos são jovens de comunidades que encontram no solar uma profissão com futuro.
                </p>
              </div>

              <div className="animate-text bg-background/70 border border-border p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-foreground mb-3">
                  Dignidade para famílias de baixa renda
                </h3>
                <p className="text-3xl md:text-4xl font-black text-primary mb-3">
                  Projetos comunitários
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Em favelas e periferias, energia solar comunitária já garante geladeira funcionando, ventilador no calor, e criança estudando à noite. A energia deixa de ser um luxo e vira um direito.
                </p>
              </div>
            </div>

            <div className="animate-text bg-primary/10 border border-primary/25 p-5 md:p-6">
              <p className="text-base md:text-xl font-bold text-foreground leading-relaxed">
                Energia solar não é só sustentável – é um caminho pra reduzir desigualdade. Quem economiza na conta pode investir em saúde, educação e lazer. E quem nunca teve luz, finalmente enxerga um amanhã.
              </p>
            </div>

            {renderNavButtons()}
          </div>
        </div>
      </div>
    </section>
  );

  const renderSolarCalculator = () => (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-24">
      <div className="max-w-5xl w-full mx-auto">
        <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="animate-text">
              <Calculator className="w-10 h-10 md:w-14 md:h-14 text-primary mb-5" />
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-tight mb-4">
                Agora calcule seu potencial solar
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                Informe o consumo mensal em kWh da sua conta de energia. Vamos estimar o tamanho do
                sistema, o investimento e a economia que aparecerá na tela final.
              </p>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-4">
                Para a economia, usamos uma tarifa fixa de R$ 0,82/kWh como referência residencial
                CEEE-D/RS. É uma estimativa simples, sem bandeiras tarifárias e outros ajustes da conta.
              </p>
            </div>

            <div className="animate-text bg-background border border-border p-4 md:p-8 space-y-4 md:space-y-5">
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
                  <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.4fr_0.8fr] gap-2 md:gap-3">
                    <div className="min-w-0 bg-muted/30 border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Sistema indicado</p>
                      <p className="text-xl md:text-2xl font-black text-foreground mt-1">
                        {numberFormatter.format(calculatorResult.kwp)} kWp
                      </p>
                    </div>
                    <div className="min-w-0 bg-muted/30 border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Investimento</p>
                      <p className="text-xl md:text-2xl font-black text-foreground mt-1 whitespace-nowrap">
                        {currencyFormatter.format(calculatorResult.systemCost)}
                      </p>
                    </div>
                    <div className="min-w-0 bg-muted/30 border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Retorno</p>
                      <p className="text-xl md:text-2xl font-black text-foreground mt-1">
                        {numberFormatter.format(calculatorResult.paybackYears)} anos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div className="bg-[hsl(var(--solar-green))] border border-[hsl(var(--solar-green))] p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground/80">
                        Economia mensal
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-accent-foreground mt-1">
                        {currencyFormatter.format(calculatorResult.monthlySavings)}
                      </p>
                    </div>
                    <div className="bg-[hsl(var(--solar-green))] border border-[hsl(var(--solar-green))] p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-accent-foreground/80">
                        Economia anual
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-accent-foreground mt-1">
                        {currencyFormatter.format(calculatorResult.annualSavings)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div className="bg-muted/30 border border-border p-4 text-center">
                      <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        CO₂ evitado em 25 anos
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-primary mt-1">
                        {numberFormatter.format(calculatorResult.avoidedCo2KgLifetime)} kg
                      </p>
                    </div>
                    <div className="bg-muted/30 border border-border p-4 text-center">
                      <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Árvores equivalentes*
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-primary mt-1">
                        {numberFormatter.format(calculatorResult.preservedTreesLifetime)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    *Equivalência de absorção de CO₂, não uma contagem literal de árvores preservadas.
                  </p>
                </div>
              ) : hasCalculated ? (
                <p className="text-sm text-destructive">
                  Informe um consumo mensal válido em kWh para calcular.
                </p>
              ) : null}

              {errorMessage && (
                <p className="text-sm text-destructive font-semibold">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            {renderNavButtons()}
          </div>
        </div>
      </div>
    </section>
  );

  const renderConfetti = () => {
    const colors = ["#f59e0b", "#22c55e", "#38bdf8", "#f97316", "#eab308", "#ffffff"];

    return (
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
        <style>
          {`
            @keyframes survey-confetti-fall {
              0% { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 1; }
              100% { transform: translate3d(var(--confetti-drift), 112vh, 0) rotate(720deg); opacity: 0; }
            }
          `}
        </style>
        {Array.from({ length: 44 }).map((_, index) => (
          <span
            key={index}
            className="absolute top-0 block h-3 w-2"
            style={{
              left: `${(index * 23) % 100}%`,
              backgroundColor: colors[index % colors.length],
              animation: `survey-confetti-fall ${2.8 + (index % 7) * 0.18}s ease-out ${index * 0.035}s forwards`,
              ["--confetti-drift" as string]: `${(index % 2 === 0 ? 1 : -1) * (24 + (index % 5) * 14)}px`,
            }}
          />
        ))}
      </div>
    );
  };

  /*
    Backup da tela final anterior da pesquisa:

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
  */

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
                    Este é um projeto de alunos de graduação da universidade feevale para divulgar e
                    informar a comunidade sobre a energia solar! Para continuar, será apenas necessário
                    saber seu consumo mensal ou a média dos últimos 3 meses.
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

                {renderStepProgress()}
              </div>
            </div>
          </div>
        </section>
      )}

      {step === "form1" && renderForm("FORMULÁRIO 1 - PRÉ-ESTUDO", formData, "pre")}
      {step === "process" && renderProcessExplanation()}
      {step === "calculator" && renderSolarCalculator()}
      {step === "content1" && renderEnvironmentalContent()}
      {step === "content2" && renderEnvironmentalContent2()}
      {step === "form2" && renderForm("FORMULÁRIO 2 - Para fixar", postFormData, "post")}

      {step === "finished" && (
        <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 py-24 overflow-hidden">
          {renderConfetti()}
          <div className="max-w-5xl w-full mx-auto relative z-10">
            <div className="chamfer-card bg-secondary border border-border p-8 md:p-16 lg:p-20">
              <div className="space-y-8 text-center">
                <div className="animate-text">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                    Parabéns, pesquisa <span className="text-gradient-solar">finalizada!</span>
                  </h1>
                  <p className="text-lg md:text-2xl font-black text-foreground mt-6 leading-relaxed">
                    Obrigado por chegar até aqui e contribuir com
                    <span className="text-primary"> dados valiosos</span> para nossa pesquisa sobre{" "}
                    <span className="text-gradient-solar">energia solar</span>.
                  </p>
                </div>

                {calculatorResult && (
                  <div className="animate-text grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-left">
                    <div className="bg-background/70 border border-primary/40 p-4 md:p-5 sm:col-span-2 lg:col-span-1">
                      <DollarSign className="w-8 h-8 text-primary mb-3" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Economia mensal
                      </p>
                      <p className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-primary leading-none">
                        {currencyFormatter.format(calculatorResult.monthlySavings)}
                      </p>
                    </div>
                    <div className="bg-background/70 border border-border p-4 md:p-5">
                      <Zap className="w-7 h-7 text-primary mb-3" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Sistema estimado
                      </p>
                      <p className="text-3xl md:text-4xl font-black text-foreground">
                        {numberFormatter.format(calculatorResult.kwp)} kWp
                      </p>
                    </div>
                    <div className="bg-background/70 border border-border p-4 md:p-5">
                      <Calculator className="w-7 h-7 text-primary mb-3" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Retorno aproximado
                      </p>
                      <p className="text-3xl md:text-4xl font-black text-foreground">
                        {numberFormatter.format(calculatorResult.paybackYears)} anos
                      </p>
                    </div>
                    <div className="bg-[hsl(var(--solar-green))] border border-[hsl(var(--solar-green))] p-4 md:p-5">
                      <Leaf className="w-7 h-7 text-accent-foreground mb-3" />
                      <p className="text-xs uppercase tracking-wider text-accent-foreground/80 mb-2">
                        CO₂ evitado em 25 anos
                      </p>
                      <p className="text-3xl md:text-4xl font-black text-accent-foreground">
                        {numberFormatter.format(calculatorResult.avoidedCo2KgLifetime)} kg
                      </p>
                    </div>
                  </div>
                )}

                {calculatorResult && (
                  <div className="animate-text bg-primary/10 border border-primary/25 p-5 md:p-6 text-left">
                    <p className="text-base md:text-xl font-bold text-foreground leading-relaxed">
                      Pela estimativa, sua casa poderia economizar cerca de{" "}
                      <span className="text-primary">
                        {currencyFormatter.format(calculatorResult.annualSavings)} por ano
                      </span>{" "}
                      Considerando 25 anos de uso do sistema, isso evita aproximadamente{" "}
                      <span className="text-primary">
                        {numberFormatter.format(calculatorResult.avoidedCo2KgLifetime)} kg de CO₂
                      </span>{" "}
                      e equivale ao carbono absorvido por cerca de{" "}
                      <span className="text-primary">
                        {numberFormatter.format(calculatorResult.preservedTreesLifetime)} árvores*
                      </span>{" "}
                      em um ano.
                    </p>
                    <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                      *Essa comparação é uma equivalência de absorção de CO₂, não uma contagem
                      literal de árvores que deixariam de ser derrubadas.
                    </p>
                  </div>
                )}

                <div className="animate-text flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-[hsl(var(--solar-green))] text-accent-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
                  >
                    <span className="relative z-10">Solicitar contato com a empresa Orizon</span>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="relative text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground overflow-hidden group transition-transform duration-300 hover:scale-105 inline-flex items-center gap-3 cursor-pointer"
                  >
                    <span className="relative z-10">Voltar para Home</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                    <span className="absolute inset-0 bg-[hsl(var(--solar-orange))] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>

                {renderStepProgress()}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Survey;
