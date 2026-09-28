import React, { useState, useMemo, useEffect } from "react";
import {
  TOPIC_HEADER,
  TEXTO_COMPLETO_PARAGRAPHS,
  TOPIC_SECTIONS,
  TABLA_MEMORIZAR,
  PREGUNTAS_RESPUESTAS,
  TEXTO_CORTO,
  VOCABULARY_LIST,
  QAItem,
  TableItem,
  BilingualItem,
} from "./lessonData";
import { speakSpanish, stopSpeech } from "./speechHelper";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Search,
  BookOpen,
  HelpCircle,
  Table2,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Languages,
  ChevronRight,
  BookMarked,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Play,
  Shuffle,
  Info,
} from "lucide-react";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "texto-completo" | "secciones" | "tabla" | "qa" | "texto-corto" | "flashcards" | "quiz"
  >("all");

  // Global translation reveal state: set of revealed item IDs
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [globalAllRevealed, setGlobalAllRevealed] = useState<boolean>(false);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Speech status
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  // Copied indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Bookmarks / Learned items
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("tema6_learned_items");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Font size state
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal");

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardCategory, setFlashcardCategory] = useState<string>("all");

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Save learned items
  useEffect(() => {
    try {
      localStorage.setItem("tema6_learned_items", JSON.stringify(Array.from(learnedIds)));
    } catch {
      // ignore
    }
  }, [learnedIds]);

  // Clean speech on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  // Toggle single item translation
  const toggleReveal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle reveal all
  const toggleAllTranslations = () => {
    if (globalAllRevealed) {
      setRevealedIds(new Set());
      setGlobalAllRevealed(false);
    } else {
      const allIds = new Set<string>();
      TEXTO_COMPLETO_PARAGRAPHS.forEach((p) => allIds.add(p.id));
      TOPIC_SECTIONS.forEach((s) => {
        s.items.forEach((item) => allIds.add(item.id));
      });
      TABLA_MEMORIZAR.forEach((t) => allIds.add(t.id));
      PREGUNTAS_RESPUESTAS.forEach((q) => allIds.add(`qa-${q.id}`));
      TEXTO_CORTO.points.forEach((_, idx) => allIds.add(`tc-point-${idx}`));
      setRevealedIds(allIds);
      setGlobalAllRevealed(true);
    }
  };

  // Speech handler
  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (speakingText === text) {
      stopSpeech();
      setSpeakingText(null);
    } else {
      setSpeakingText(text);
      speakSpanish(
        text,
        speechRate,
        () => setSpeakingText(text),
        () => setSpeakingText(null),
        () => setSpeakingText(null)
      );
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Toggle bookmark learned
  const toggleLearned = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter items based on search query
  const query = searchQuery.trim().toLowerCase();

  const filteredTextoCompleto = useMemo(() => {
    if (!query) return TEXTO_COMPLETO_PARAGRAPHS;
    return TEXTO_COMPLETO_PARAGRAPHS.filter(
      (p) =>
        p.es.toLowerCase().includes(query) ||
        p.am.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredSections = useMemo(() => {
    if (!query) return TOPIC_SECTIONS;
    return TOPIC_SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (item) =>
          sec.titleEs.toLowerCase().includes(query) ||
          sec.titleAm.toLowerCase().includes(query) ||
          item.es.toLowerCase().includes(query) ||
          item.am.toLowerCase().includes(query) ||
          (item.exampleEs && item.exampleEs.toLowerCase().includes(query)) ||
          (item.exampleAm && item.exampleAm.toLowerCase().includes(query))
      ),
    })).filter((sec) => sec.items.length > 0 || sec.titleEs.toLowerCase().includes(query));
  }, [query]);

  const filteredQA = useMemo(() => {
    if (!query) return PREGUNTAS_RESPUESTAS;
    return PREGUNTAS_RESPUESTAS.filter(
      (qa) =>
        qa.questionEs.toLowerCase().includes(query) ||
        qa.questionAm.toLowerCase().includes(query) ||
        qa.answerEs.toLowerCase().includes(query) ||
        qa.answerAm.toLowerCase().includes(query)
    );
  }, [query]);

  // Flashcards items
  const flashcardItems = useMemo(() => {
    const list: Array<{ id: string; es: string; am: string; label: string; sub?: string }> = [];
    
    // Add QA questions
    PREGUNTAS_RESPUESTAS.forEach((qa) => {
      list.push({
        id: `fc-qa-${qa.id}`,
        es: qa.questionEs,
        am: `${qa.questionAm}\n\n💡 Պատասխան՝\n🇪🇸 ${qa.answerEs}\n🇦🇲 ${qa.answerAm}`,
        label: `Հարց ${qa.id}`,
        sub: qa.category,
      });
    });

    // Add 4 levels
    TABLA_MEMORIZAR.forEach((t) => {
      list.push({
        id: `fc-tab-${t.id}`,
        es: `¿Qué estudia el nivel ${t.nivel.toLowerCase()}?`,
        am: `${t.nivelAm} մակարդակն ուսումնասիրում է՝ ${t.queEstudiaAm} (${t.queEstudia})։\nՕրինակ՝ ${t.exampleAm}`,
        label: `Մակարդակ՝ ${t.nivel}`,
        sub: t.nivelAm,
      });
    });

    // Add 3 key concepts: Lenguaje, Lengua, Habla
    list.push({
      id: "fc-c1",
      es: "¿Qué es el lenguaje?",
      am: "Lenguaje-ը մարդու՝ նշանների միջոցով հաղորդակցվելու ընդհանուր կարողությունն է։\n(Es la capacidad humana de comunicarse mediante signos.)",
      label: "Lenguaje",
    });
    list.push({
      id: "fc-c2",
      es: "¿Qué es la lengua?",
      am: "Lengua-ն որոշակի համայնքի նշանների և կանոնների համակարգն է (օր. իսպաներեն կամ հայերեն)։\n(Es un sistema de signos y reglas utilizado por una comunidad.)",
      label: "Lengua",
    });
    list.push({
      id: "fc-c3",
      es: "¿Qué es el habla?",
      am: "Habla-ն յուրաքանչյուր մարդու կողմից լեզվի անհատական օգտագործումն է։\n(Es la forma particular en que cada persona utiliza una lengua.)",
      label: "Habla",
    });

    return list;
  }, []);

  const currentFlashcard = flashcardItems[flashcardIndex] || flashcardItems[0];

  // Quiz questions generated directly from user content
  const quizQuestions = useMemo(() => {
    return [
      {
        question: "¿Qué es la lengua?",
        questionAm: "Ի՞նչ է լեզուն։",
        options: [
          { text: "Es un sistema de signos y reglas que utilizamos para comunicarnos.", isCorrect: true },
          { text: "Es el uso particular e individual de los sonidos.", isCorrect: false },
          { text: "Es únicamente la capacidad biológica del ser humano.", isCorrect: false },
          { text: "Es una colección de palabras sin ningún orden ni reglas.", isCorrect: false },
        ],
        explanation: "La lengua es un sistema de signos y reglas que utilizamos para comunicarnos (Լեզուն նշանների և կանոնների համակարգ է, որը մենք օգտագործում ենք հաղորդակցվելու համար)։",
      },
      {
        question: "¿Por qué decimos que la lengua es un sistema?",
        questionAm: "Ինչո՞ւ ենք ասում, որ լեզուն համակարգ է։",
        options: [
          { text: "Porque se inventó en un solo país.", isCorrect: false },
          { text: "Porque todos sus elementos están relacionados y siguen reglas.", isCorrect: true },
          { text: "Porque cambia todos los días por completo.", isCorrect: false },
          { text: "Porque solo tiene nivel morfológico.", isCorrect: false },
        ],
        explanation: "Es un sistema porque todos sus elementos están relacionados entre sí y siguen unas reglas / normas.",
      },
      {
        question: "¿Qué estudia el nivel fónico?",
        questionAm: "Ի՞նչ է ուսումնասիրում հնչյունական մակարդակը։",
        options: [
          { text: "El significado de los textos.", isCorrect: false },
          { text: "La combinación de palabras en la oración.", isCorrect: false },
          { text: "Los sonidos de la lengua.", isCorrect: true },
          { text: "La historia de las comunidades.", isCorrect: false },
        ],
        explanation: "El nivel fónico estudia los sonidos de la lengua (Հնչյունական մակարդակը ուսումնասիրում է լեզվի հնչյունները)։ Օրինակ՝ /p/, /a/, /n/ → «pan»։",
      },
      {
        question: "¿Qué estudia el nivel morfológico?",
        questionAm: "Ի՞նչ է ուսումնասիրում ձևաբանական մակարդակը։",
        options: [
          { text: "La forma y la estructura de las palabras.", isCorrect: true },
          { text: "Solamente los sonidos.", isCorrect: false },
          { text: "El orden de los párrafos en un libro.", isCorrect: false },
          { text: "La entonación de la voz.", isCorrect: false },
        ],
        explanation: "El nivel morfológico estudia la forma y la estructura de las palabras (Ձևաբանական մակարդակը ուսումնասիրում է բառերի ձևն ու կառուցվածքը)։ Օր.՝ niño / niños (-s = plural)։",
      },
      {
        question: "¿Qué estudia el nivel sintáctico?",
        questionAm: "Ի՞նչ է ուսումնասիրում շարահյուսական մակարդակը։",
        options: [
          { text: "Cómo se combinan las palabras para formar oraciones.", isCorrect: true },
          { text: "El significado de las palabras aisladas.", isCorrect: false },
          { text: "Los órganos del habla.", isCorrect: false },
          { text: "Las letras mayúsculas.", isCorrect: false },
        ],
        explanation: "El nivel sintáctico estudia cómo se combinan las palabras en una oración (Շարահյուսական մակարդակը ուսումնասիրում է բառերի միավորումը նախադասության մեջ)։ Օր.՝ «Pedro estudia español»։",
      },
      {
        question: "¿Qué estudia el nivel semántico?",
        questionAm: "Ի՞նչ է ուսումնասիրում իմաստաբանական մակարդակը։",
        options: [
          { text: "El significado de las palabras y de las expresiones.", isCorrect: true },
          { text: "La pronunciación de las consonantes.", isCorrect: false },
          { text: "La velocidad al hablar.", isCorrect: false },
          { text: "El número de sílabas.", isCorrect: false },
        ],
        explanation: "El nivel semántico estudia el significado de las palabras y expresiones (Իմաստաբանական մակարդակը ուսումնասիրում է բառերի և արտահայտությունների իմաստը)։",
      },
      {
        question: "¿Qué es el habla?",
        questionAm: "Ի՞նչ է habla-ն։",
        options: [
          { text: "La manera particular en que cada persona utiliza una lengua.", isCorrect: true },
          { text: "Un diccionario oficial de la lengua.", isCorrect: false },
          { text: "La capacidad universal de todos los seres humanos.", isCorrect: false },
          { text: "Un conjunto de leyes escritas.", isCorrect: false },
        ],
        explanation: "El habla es la manera particular en que cada persona utiliza una lengua (Habla-ն յուրաքանչյուր մարդու կողմից լեզվի անհատական օգտագործումն է)։",
      },
      {
        question: "¿Cuál es la jerarquía correcta de las unidades lingüísticas?",
        questionAm: "Ո՞րն է լեզվական միավորների ճիշտ հաջորդականությունը։",
        options: [
          { text: "Sonidos → Palabras → Oraciones → Textos", isCorrect: true },
          { text: "Textos → Sonidos → Oraciones → Palabras", isCorrect: false },
          { text: "Palabras → Textos → Sonidos → Oraciones", isCorrect: false },
          { text: "Oraciones → Sonidos → Palabras → Textos", isCorrect: false },
        ],
        explanation: "Los sonidos forman palabras, las palabras forman oraciones y las oraciones forman textos.",
      },
      {
        question: "¿Qué es el lenguaje?",
        questionAm: "Ի՞նչ է lenguaje-ը։",
        options: [
          { text: "La capacidad humana de comunicarse mediante signos.", isCorrect: true },
          { text: "Una sola lengua como el español.", isCorrect: false },
          { text: "El acento de una persona específica.", isCorrect: false },
          { text: "Un examen de gramática.", isCorrect: false },
        ],
        explanation: "El lenguaje es la capacidad humana de comunicarse mediante signos (Lenguaje-ը մարդու՝ նշանների միջոցով հաղորդակցվելու կարողությունն է)։",
      },
      {
        question: "En «niño» y «niños», ¿qué indica la terminación «-s»?",
        questionAm: "«niño» և «niños» բառերում ի՞նչ է ցույց տալիս «-s» վերջավորությունը։",
        options: [
          { text: "Indica plural (հոգնակի թիվ)", isCorrect: true },
          { text: "Indica pasado (անցյալ ժամանակ)", isCorrect: false },
          { text: "Indica femenino (իգական սեռ)", isCorrect: false },
          { text: "Indica futuro (ապառնի ժամանակ)", isCorrect: false },
        ],
        explanation: "En el nivel morfológico, la «-s» indica plural (երեխա / երեխաներ)։",
      },
    ];
  }, []);

  const handleAnswerQuiz = (index: number) => {
    if (quizIsAnswered) return;
    setQuizSelectedOption(index);
    setQuizIsAnswered(true);
    if (quizQuestions[quizCurrentIndex].options[index].isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizCurrentIndex + 1 < quizQuestions.length) {
      setQuizCurrentIndex((prev) => prev + 1);
      setQuizSelectedOption(null);
      setQuizIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizCurrentIndex(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setQuizIsAnswered(false);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // Font size classes
  const fontClasses = {
    normal: {
      es: "text-base md:text-lg",
      am: "text-sm md:text-base",
    },
    large: {
      es: "text-lg md:text-xl",
      am: "text-base md:text-lg",
    },
    xl: {
      es: "text-xl md:text-2xl",
      am: "text-lg md:text-xl",
    },
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Title & Badges */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-inner">
                <span className="text-sm font-extrabold tracking-tight">T6</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {TOPIC_HEADER.themeNumber} 🇪🇸 ↔ 🇦🇲 {TOPIC_HEADER.themeNumberAm}
                  </span>
                  <span className="text-xs text-indigo-200 hidden sm:inline">
                    Իսպաներեն ուսուցում հայերեն թարգմանությամբ
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                  {TOPIC_HEADER.titleEs}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                  {TOPIC_HEADER.titleAm}
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
              {/* Toggle all translations button */}
              <button
                onClick={toggleAllTranslations}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  globalAllRevealed
                    ? "bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300"
                    : "bg-indigo-700/80 hover:bg-indigo-600 text-white border border-indigo-500/40"
                }`}
                title={
                  globalAllRevealed
                    ? "Թաքցնել հայերեն թարգմանությունները"
                    : "Բացել բոլոր հայերեն թարգմանությունները"
                }
              >
                {globalAllRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{globalAllRevealed ? "Թաքցնել թարգմանությունը" : "Բացել բոլորը"}</span>
              </button>

              {/* Speech rate toggle */}
              <button
                onClick={() => setSpeechRate((r) => (r === 0.9 ? 0.75 : r === 0.75 ? 1.0 : 0.9))}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1"
                title="Արտասանության արագություն (Velocidad de audio)"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{speechRate === 0.75 ? "Դանդաղ" : speechRate === 1.0 ? "Արագ" : "0.9x"}</span>
              </button>

              {/* Font size toggle */}
              <button
                onClick={() =>
                  setFontSize((s) => (s === "normal" ? "large" : s === "large" ? "xl" : "normal"))
                }
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
                title="Տառաչափ (Tamaño de fuente)"
              >
                Aa {fontSize === "normal" ? "1x" : fontSize === "large" ? "1.2x" : "1.4x"}
              </button>

              {/* Learned badge */}
              {learnedIds.size > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{learnedIds.size} յուրացված</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Փնտրել իսպաներեն կամ հայերեն (Buscar palabra: fónico, morfológico, habla, signo...)..."
              className="w-full bg-indigo-950/60 text-white placeholder-indigo-300/60 rounded-xl pl-9 pr-8 py-2 text-sm border border-indigo-700/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-indigo-950/90 border-t border-indigo-800/60 overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 flex gap-1 sm:gap-2 py-1.5 min-w-max">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "all"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Ամբողջ թեման (Todo)</span>
            </button>
            <button
              onClick={() => setActiveTab("texto-completo")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "texto-completo"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Լիարժեք տեքստ (Texto completo)</span>
            </button>
            <button
              onClick={() => setActiveTab("secciones")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "secciones"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1–6 Բաժիններ (Secciones)</span>
            </button>
            <button
              onClick={() => setActiveTab("tabla")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "tabla"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Հիշելու Աղյուսակ (Tabla)</span>
            </button>
            <button
              onClick={() => setActiveTab("qa")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "qa"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>15 Հարց ու Պատասխան (Q&A)</span>
            </button>
            <button
              onClick={() => setActiveTab("texto-corto")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "texto-corto"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Կարճ տեքստ (Resumen)</span>
            </button>
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "flashcards"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Քարտեր (Tarjetas)</span>
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-800/60"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Վիկտորինա (Quiz)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Helper Banner */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs sm:text-sm text-amber-900 flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-800 font-bold text-xs shrink-0">
              💡
            </span>
            <span>
              <strong>Հուշում՝</strong> Սեղմեք ցանկացած <strong>իսպաներեն նախադասության կամ քարտի վրա</strong>՝ հայերեն թարգմանությունը բացելու համար։
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-amber-800/80">
            <span>🔊 Լսել իսպաներեն արտասանությունը</span>
            <span>⭐ Նշել որպես յուրացված</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* ============================================================== */}
        {/* TAB 1: ALL / COMPREHENSIVE VIEW */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "texto-completo") && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Տեքստ / Texto
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Texto completo / Լիարժեք տեքստ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Սեղմեք իսպաներեն յուրաքանչյուր նախադասության վրա՝ հայերեն թարգմանությունն ակնթարթորեն տեսնելու համար։
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleSpeak(
                      TEXTO_COMPLETO_PARAGRAPHS.map((p) => p.es).join(". ")
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Լսել ամբողջը</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTextoCompleto.length === 0 ? (
                <p className="text-slate-400 py-6 text-center text-sm">Համընկնումներ չեն գտնվել։</p>
              ) : (
                filteredTextoCompleto.map((item, index) => {
                  const isRevealed = revealedIds.has(item.id);
                  const isLearned = learnedIds.has(item.id);
                  const isSpeaking = speakingText === item.es;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleReveal(item.id)}
                      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer p-4 ${
                        isRevealed
                          ? "bg-amber-50/40 border-amber-300/80 shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-200/90 hover:border-indigo-300"
                      }`}
                    >
                      {/* Top bar of item */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            🇪🇸 Español
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 text-slate-400" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleSpeak(item.es, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSpeaking
                                ? "bg-amber-500 text-white"
                                : "hover:bg-slate-100 hover:text-slate-700"
                            }`}
                            title="Արտասանել (Escuchar)"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleCopy(item.es, item.id, e)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Պատճենել"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => toggleLearned(item.id, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isLearned
                                ? "text-emerald-600 bg-emerald-50"
                                : "hover:bg-slate-100 hover:text-slate-700"
                            }`}
                            title={isLearned ? "Յուրացված է" : "Նշել որպես յուրացված"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => toggleReveal(item.id, e)}
                            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                              isRevealed
                                ? "bg-amber-200 text-amber-900"
                                : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
                            }`}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span className="text-[11px] hidden sm:inline">Փակել</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span className="text-[11px] hidden sm:inline">Թարգմանություն</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Spanish sentence (Clickable) */}
                      <div className="pr-2">
                        <p
                          className={`font-semibold text-slate-900 leading-relaxed group-hover:text-indigo-950 transition-colors ${fontClasses.es}`}
                        >
                          {item.es}
                        </p>
                      </div>

                      {/* Click prompt hint when not revealed */}
                      {!isRevealed && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-indigo-600 transition-colors font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Սեղմեք՝ հայերեն թարգմանությունը տեսնելու համար</span>
                        </div>
                      )}

                      {/* Armenian Translation (Revealed) */}
                      {isRevealed && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 bg-amber-50/60 -mx-4 -mb-4 p-4 rounded-b-xl animate-fadeIn">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                            <span>🇦🇲 Հայերեն թարգմանություն՝</span>
                          </div>
                          <p
                            className={`font-medium text-amber-950 leading-relaxed ${fontClasses.am}`}
                          >
                            {item.am}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SECTIONS 1 - 6 */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "secciones") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Հիմնական կետեր / Secciones 1-6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  1-6. Հիմնական բաժիններ (Explicación por secciones)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Մակարդակների բացատրություն, օրինակներ և տարբերությունները
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSections.map((sec) => (
                <div
                  key={sec.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          {sec.number}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                            {sec.titleEs}
                          </h3>
                          <p className="text-xs sm:text-sm text-indigo-600 font-medium">
                            {sec.titleAm}
                          </p>
                        </div>
                      </div>
                      {sec.badge && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {sec.badge}
                        </span>
                      )}
                    </div>

                    {/* Content Items */}
                    <div className="space-y-3.5">
                      {sec.items.map((item) => {
                        const isRevealed = revealedIds.has(item.id);
                        const isSpeaking = speakingText === item.es;

                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleReveal(item.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isRevealed
                                ? "bg-amber-50/50 border-amber-300"
                                : "bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/70"
                            }`}
                          >
                            {/* Label if exists (e.g. Lenguaje, Lengua, Habla) */}
                            {item.label && (
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                                  {item.label}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {item.labelAm}
                                </span>
                              </div>
                            )}

                            {/* Spanish Statement */}
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-semibold text-slate-900 leading-snug ${fontClasses.es}`}>
                                {item.es}
                              </p>
                              <button
                                onClick={(e) => handleSpeak(item.es, e)}
                                className={`p-1 rounded-md shrink-0 transition-colors ${
                                  isSpeaking ? "bg-amber-500 text-white" : "hover:bg-slate-200 text-slate-500"
                                }`}
                                title="Լսել արտասանությունը"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Examples in Spanish */}
                            {item.exampleEs && (
                              <div className="mt-2 p-2 rounded-lg bg-white border border-slate-200/60 text-xs sm:text-sm">
                                <span className="font-bold text-indigo-700">Ejemplo: </span>
                                <span className="font-medium text-slate-800">{item.exampleEs}</span>
                              </div>
                            )}

                            {/* Note in Spanish */}
                            {item.noteEs && (
                              <div className="mt-1.5 text-xs text-slate-600 italic">
                                ℹ️ {item.noteEs}
                              </div>
                            )}

                            {/* Reveal Hint or Armenian Content */}
                            {!isRevealed ? (
                              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800">
                                <Eye className="w-3 h-3" />
                                <span>Սեղմեք հայերեն թարգմանության համար</span>
                              </div>
                            ) : (
                              <div className="mt-2.5 pt-2 border-t border-amber-200 text-xs sm:text-sm animate-fadeIn">
                                <div className="text-[11px] font-bold text-amber-800 mb-0.5">
                                  🇦🇲 Հայերեն՝
                                </div>
                                <p className="font-medium text-amber-950 leading-relaxed">
                                  {item.am}
                                </p>
                                {item.exampleAm && (
                                  <div className="mt-1.5 p-2 rounded-lg bg-amber-100/60 border border-amber-200/70 text-xs text-amber-900">
                                    <span className="font-bold">Օրինակ՝ </span>
                                    <span>{item.exampleAm}</span>
                                  </div>
                                )}
                                {item.noteAm && (
                                  <div className="mt-1 text-xs text-amber-800 italic">
                                    ℹ️ {item.noteAm}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TABLA PARA MEMORIZAR */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "tabla") && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Հիշողության համար / Para memorizar
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Tabla para memorizar / Աղյուսակ՝ հիշելու համար
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Լեզվի 4 մակարդակների համեմատական ամփոփիչ աղյուսակ
                </p>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs sm:text-sm">
                    <th className="p-3.5 font-bold">Nivel / Մակարդակ</th>
                    <th className="p-3.5 font-bold">¿Qué estudia? (Իսպաներեն)</th>
                    <th className="p-3.5 font-bold">Հայերեն թարգմանություն</th>
                    <th className="p-3.5 font-bold text-center">Լսել</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {TABLA_MEMORIZAR.map((row) => {
                    const isRevealed = revealedIds.has(row.id);
                    const isSpeaking = speakingText === `${row.nivel}. ${row.queEstudia}`;

                    return (
                      <tr
                        key={row.id}
                        onClick={() => toggleReveal(row.id)}
                        className={`transition-colors cursor-pointer ${
                          isRevealed ? "bg-amber-50/60" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Nivel */}
                        <td className="p-3.5 font-bold text-slate-900 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                            <span className="text-base text-indigo-900">{row.nivel}</span>
                          </div>
                          <span className="text-xs font-normal text-slate-500 block mt-0.5">
                            {row.nivelAm}
                          </span>
                        </td>

                        {/* Que estudia */}
                        <td className="p-3.5 align-top">
                          <div className="font-semibold text-slate-800 text-sm sm:text-base">
                            {row.queEstudia}
                          </div>
                          {row.example && (
                            <div className="text-xs text-indigo-700 bg-indigo-50/60 px-2 py-1 rounded mt-1 font-mono">
                              {row.example}
                            </div>
                          )}
                        </td>

                        {/* Armenian translation */}
                        <td className="p-3.5 align-top">
                          {isRevealed ? (
                            <div className="animate-fadeIn">
                              <span className="font-bold text-amber-900 text-sm sm:text-base">
                                {row.queEstudiaAm}
                              </span>
                              {row.exampleAm && (
                                <div className="text-xs text-amber-800 bg-amber-100/50 px-2 py-1 rounded mt-1">
                                  {row.exampleAm}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Սեղմեք թարգմանության համար</span>
                            </div>
                          )}
                        </td>

                        {/* Speak Button */}
                        <td className="p-3.5 text-center align-top">
                          <button
                            onClick={(e) =>
                              handleSpeak(`${row.nivel}. Estudia: ${row.queEstudia}`, e)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              isSpeaking
                                ? "bg-amber-500 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                            title="Լսել իսպաներեն"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PREGUNTAS Y RESPUESTAS (1 - 15) */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "qa") && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Հարցաշար / 15 Preguntas
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Preguntas y respuestas / Հարցեր և պատասխաններ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Թեմայի բոլոր 15 հարցերն ու պատասխանները։ Սեղմեք՝ պատասխանը և հայերեն թարգմանությունը բացելու համար։
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">
                  {filteredQA.length} հարց
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredQA.map((qa) => {
                const qaId = `qa-${qa.id}`;
                const isRevealed = revealedIds.has(qaId);
                const isLearned = learnedIds.has(qaId);
                const isSpeakingQ = speakingText === qa.questionEs;
                const isSpeakingA = speakingText === qa.answerEs;

                return (
                  <div
                    key={qa.id}
                    onClick={() => toggleReveal(qaId)}
                    className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                      isRevealed
                        ? "bg-amber-50/40 border-amber-300 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200/90 hover:border-indigo-300"
                    }`}
                  >
                    {/* Header line with question number and category */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {qa.id}
                        </span>
                        {qa.category && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {qa.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleSpeak(qa.questionEs, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSpeakingQ ? "bg-amber-500 text-white" : "hover:bg-slate-100 text-slate-500"
                          }`}
                          title="Լսել հարցը"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => toggleLearned(qaId, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLearned ? "text-emerald-600 bg-emerald-50" : "hover:bg-slate-100 text-slate-400"
                          }`}
                          title={isLearned ? "Յուրացված է" : "Նշել որպես յուրացված"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question (Spanish + Armenian) */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-bold text-slate-900 ${fontClasses.es}`}>
                          🇪🇸 {qa.questionEs}
                        </p>
                      </div>
                      <p className={`font-medium text-slate-600 ${fontClasses.am}`}>
                        🇦🇲 {qa.questionAm}
                      </p>
                    </div>

                    {/* Reveal Button / Preview */}
                    {!isRevealed ? (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Սեղմեք պատասխանը տեսնելու համար (Ver respuesta)</span>
                      </div>
                    ) : (
                      /* Answer Area (Revealed) */
                      <div className="mt-4 pt-3 border-t border-amber-200/80 space-y-2 animate-fadeIn bg-amber-50/70 p-3.5 rounded-xl">
                        {/* Spanish Answer */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide block mb-0.5">
                              Պատասխան (Español):
                            </span>
                            <p className={`font-bold text-indigo-950 ${fontClasses.es}`}>
                              🇪🇸 {qa.answerEs}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleSpeak(qa.answerEs, e)}
                            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                              isSpeakingA
                                ? "bg-amber-500 text-white"
                                : "hover:bg-amber-200/60 text-amber-900"
                            }`}
                            title="Լսել պատասխանը"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Armenian Answer */}
                        <div className="pt-2 border-t border-amber-200/60">
                          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block mb-0.5">
                            Հայերեն թարգմանություն:
                          </span>
                          <p className={`font-medium text-amber-950 leading-relaxed ${fontClasses.am}`}>
                            🇦🇲 {qa.answerAm}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 5: TEXTO CORTO / RESUMEN */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "texto-corto") && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Ամփոփում / Resumen
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {TEXTO_CORTO.titleEs} / {TEXTO_CORTO.titleAm}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Հակիրճ տեքստ արագ կրկնության համար։
                </p>
              </div>

              <button
                onClick={() => handleSpeak(TEXTO_CORTO.es)}
                className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Լսել կարճ տեքստը</span>
              </button>
            </div>

            <div className="space-y-4">
              {TEXTO_CORTO.points.map((pt, idx) => {
                const ptId = `tc-point-${idx}`;
                const isRevealed = revealedIds.has(ptId);
                const isSpeaking = speakingText === pt.es;

                return (
                  <div
                    key={ptId}
                    onClick={() => toggleReveal(ptId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isRevealed
                        ? "bg-amber-50/50 border-amber-300"
                        : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className={`font-semibold text-slate-900 leading-relaxed ${fontClasses.es}`}>
                        {pt.es}
                      </p>
                      <button
                        onClick={(e) => handleSpeak(pt.es, e)}
                        className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                          isSpeaking ? "bg-amber-500 text-white" : "hover:bg-slate-200 text-slate-600"
                        }`}
                        title="Լսել"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!isRevealed ? (
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Սեղմեք՝ հայերեն թարգմանությունը տեսնելու համար</span>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-amber-200 animate-fadeIn">
                        <div className="text-xs font-bold text-amber-800 mb-0.5">
                          🇦🇲 Հայերեն՝
                        </div>
                        <p className={`font-medium text-amber-950 leading-relaxed ${fontClasses.am}`}>
                          {pt.am}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 6: FLASHCARDS (INTERACTIVE STUDY CARDS) */}
        {/* ============================================================== */}
        {activeTab === "flashcards" && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full text-center max-w-xl mb-6">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Ինտերակտիվ քարտեր
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Ֆլեշքարտեր (Tarjetas de estudio)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ստուգեք Ձեր գիտելիքները։ Սեղմեք քարտի վրա՝ շրջելու և հայերեն պատասխանը տեսնելու համար։
              </p>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  {flashcardIndex + 1} / {flashcardItems.length}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${((flashcardIndex + 1) / flashcardItems.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Flashcard Box */}
            <div
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className={`w-full max-w-xl min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer border-2 transition-all duration-300 shadow-lg ${
                isCardFlipped
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-amber-100"
                  : "bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white border-indigo-700 shadow-indigo-100"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isCardFlipped
                      ? "bg-amber-200 text-amber-900"
                      : "bg-white/20 text-indigo-100"
                  }`}
                >
                  {currentFlashcard.label}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleSpeak(currentFlashcard.es, e)}
                    className={`p-2 rounded-xl transition-colors ${
                      isCardFlipped
                        ? "bg-amber-200/80 hover:bg-amber-300 text-amber-900"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Center Content */}
              <div className="py-6 my-auto text-center">
                {!isCardFlipped ? (
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 block">
                      🇪🇸 Իսպաներեն հարց / հասկացություն
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed">
                      {currentFlashcard.es}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fadeIn">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 block">
                      🇦🇲 Հայերեն պատասխան
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                      {currentFlashcard.am}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Hint */}
              <div className="text-center text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full ${
                    isCardFlipped
                      ? "text-amber-800 bg-amber-200/50"
                      : "text-indigo-200 bg-white/10"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isCardFlipped ? "Սեղմեք՝ նորից հարցը տեսնելու համար" : "Սեղմեք քարտին՝ պատասխանը բացելու համար"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setFlashcardIndex((i) => Math.max(0, i - 1));
                }}
                disabled={flashcardIndex === 0}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Նախորդը</span>
              </button>

              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setFlashcardIndex((i) =>
                    i + 1 < flashcardItems.length ? i + 1 : 0
                  );
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{flashcardIndex + 1 === flashcardItems.length ? "Սկզբից" : "Հաջորդը"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 7: QUIZ / TEST MODE */}
        {/* ============================================================== */}
        {activeTab === "quiz" && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-8 max-w-2xl mx-auto">
            {!quizStarted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Ստուգեք Ձեր գիտելիքները (Test Tema 6)
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  10 ինտերակտիվ հարց «Tema 6: La lengua como sistema» թեմայից։ Ստուգեք, թե որքան լավ եք յուրացրել մակարդակներն ու հիմնական կանոնները։
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuizStarted(true);
                      setQuizCurrentIndex(0);
                      setQuizScore(0);
                      setQuizSelectedOption(null);
                      setQuizIsAnswered(false);
                      setQuizCompleted(false);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Սկսել թեստը (10 հարց)</span>
                  </button>
                </div>
              </div>
            ) : !quizCompleted ? (
              <div>
                {/* Question progress */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
                  <span>Հարց {quizCurrentIndex + 1} / {quizQuestions.length}</span>
                  <span>Միավորներ՝ {quizScore}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${((quizCurrentIndex + 1) / quizQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Current Question */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        🇪🇸 {quizQuestions[quizCurrentIndex].question}
                      </h3>
                      <p className="text-sm font-medium text-indigo-700 mt-1">
                        🇦🇲 {quizQuestions[quizCurrentIndex].questionAm}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSpeak(quizQuestions[quizCurrentIndex].question)}
                      className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 shrink-0"
                      title="Լսել"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {quizQuestions[quizCurrentIndex].options.map((opt, optIndex) => {
                    const isSelected = quizSelectedOption === optIndex;
                    let optionStyle =
                      "border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-slate-800";

                    if (quizIsAnswered) {
                      if (opt.isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                      } else if (isSelected) {
                        optionStyle = "border-rose-500 bg-rose-50 text-rose-950";
                      } else {
                        optionStyle = "border-slate-200 opacity-50 bg-slate-50";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        disabled={quizIsAnswered}
                        onClick={() => handleAnswerQuiz(optIndex)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            quizIsAnswered && opt.isCorrect
                              ? "bg-emerald-600 text-white"
                              : quizIsAnswered && isSelected && !opt.isCorrect
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="text-sm sm:text-base leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation after answered */}
                {quizIsAnswered && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 animate-fadeIn">
                    <span className="font-bold block mb-1">💡 Պարզաբանում՝</span>
                    <p>{quizQuestions[quizCurrentIndex].explanation}</p>
                  </div>
                )}

                {/* Next button */}
                {quizIsAnswered && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <span>
                      {quizCurrentIndex + 1 === quizQuestions.length
                        ? "Ավարտել և տեսնել արդյունքը"
                        : "Հաջորդ հարցը"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* Quiz Result */
              <div className="text-center py-6 animate-fadeIn">
                <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
                  {quizScore}/{quizQuestions.length}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {quizScore >= 8
                    ? "🎉 Գերազանց արդյունք։"
                    : quizScore >= 5
                    ? "👍 Լավ է, բայց կարելի է կրկնել։"
                    : "📚 Խորհուրդ է տրվում կրկնել նյութը։"}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Դուք ճիշտ եք պատասխանել {quizQuestions.length} հարցից {quizScore}-ին (
                  {Math.round((quizScore / quizQuestions.length) * 100)}%)։
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Կրկնել թեստը</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("all")}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    Վերադառնալ դասին
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* FAST VOCABULARY ACCORDION / FOOTER BAR */}
        {/* ============================================================== */}
        <section className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Հիմնական բառապաշար (Vocabulario clave)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Թեմայի առանցքային տերմիններն ու հասկացությունները՝ արտասանությամբ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {VOCABULARY_LIST.map((voc, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(voc.es)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                      {voc.es}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      {voc.tag}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 block mt-0.5">
                    {voc.am}
                  </span>
                </div>
                <button
                  className="p-1 rounded-lg text-slate-400 group-hover:text-amber-300 transition-colors"
                  title="Լսել"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Quick Help */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Tema 6: La lengua como sistema</strong> • Իսպաներենի ուսուցում հայերեն բացատրությամբ
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>✨ Սեղմեք ցանկացած տեքստի վրա՝ թարգմանությունը բացելու համար</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
