export interface BilingualItem {
  id: string;
  es: string;
  am: string;
  label?: string;
  labelAm?: string;
  exampleEs?: string;
  exampleAm?: string;
  noteEs?: string;
  noteAm?: string;
}

export interface TableItem {
  id: string;
  nivel: string;
  nivelAm: string;
  queEstudia: string;
  queEstudiaAm: string;
  example?: string;
  exampleAm?: string;
}

export interface QAItem {
  id: number;
  questionEs: string;
  questionAm: string;
  answerEs: string;
  answerAm: string;
  category?: string;
}

export interface SectionData {
  id: string;
  number?: string;
  titleEs: string;
  titleAm: string;
  iconName: string;
  badge?: string;
  items: BilingualItem[];
}

export const TOPIC_HEADER = {
  themeNumber: "TEMA 6",
  themeNumberAm: "ԹԵՄԱ 6",
  titleEs: "LA LENGUA COMO SISTEMA",
  titleAm: "ԼԵԶՈՒՆ ՈՐՊԵՍ ՀԱՄԱԿԱՐԳ",
  subtitleEs: "Español para armenios: estructura, niveles y conceptos fundamentales",
  subtitleAm: "Իսպաներեն հայախոսների համար՝ կառուցվածք, մակարդակներ և հիմնական հասկացություններ",
};

export const TEXTO_COMPLETO_PARAGRAPHS: BilingualItem[] = [
  {
    id: "tc-1",
    es: "La lengua es un sistema de signos que utilizamos para comunicarnos.",
    am: "Լեզուն նշանների համակարգ է, որը մենք օգտագործում ենք հաղորդակցվելու համար։",
  },
  {
    id: "tc-2",
    es: "Estos signos no aparecen de manera aislada, sino que se organizan siguiendo unas reglas. Gracias a estas reglas podemos formar palabras, oraciones y textos que tienen sentido.",
    am: "Այս նշանները առանձին չեն գործում, այլ կազմակերպվում են որոշակի կանոններով։ Այդ կանոնների շնորհիվ մենք կարողանում ենք կազմել բառեր, նախադասություններ և իմաստ ունեցող տեքստեր։",
  },
  {
    id: "tc-3",
    es: "La lengua está organizada en diferentes niveles: el nivel fónico, el nivel morfológico, el nivel sintáctico y el nivel semántico.",
    am: "Լեզուն կազմակերպված է տարբեր մակարդակներով՝ հնչյունական, ձևաբանական, շարահյուսական և իմաստաբանական։",
  },
  {
    id: "tc-4",
    es: "El nivel fónico estudia los sonidos de la lengua.",
    am: "Հնչյունական մակարդակը ուսումնասիրում է լեզվի հնչյունները։",
  },
  {
    id: "tc-5",
    es: "El nivel morfológico estudia la forma y la estructura de las palabras.",
    am: "Ձևաբանական մակարդակը ուսումնասիրում է բառերի ձևն ու կառուցվածքը։",
  },
  {
    id: "tc-6",
    es: "El nivel sintáctico estudia cómo se combinan las palabras para formar oraciones.",
    am: "Շարահյուսական մակարդակը ուսումնասիրում է, թե ինչպես են բառերը միավորվում նախադասություններ կազմելու համար։",
  },
  {
    id: "tc-7",
    es: "El nivel semántico estudia el significado de las palabras y de las expresiones.",
    am: "Իմաստաբանական մակարդակը ուսումնասիրում է բառերի և արտահայտությունների իմաստը։",
  },
  {
    id: "tc-8",
    es: "Además, en una lengua existen unidades diferentes. Los sonidos se combinan para formar palabras, las palabras se combinan para formar oraciones y las oraciones pueden formar textos.",
    am: "Բացի դրանից, լեզվում կան տարբեր միավորներ։ Հնչյունները միավորվում են և կազմում բառեր, բառերը՝ նախադասություններ, իսկ նախադասությունները՝ տեքստեր։",
  },
  {
    id: "tc-9",
    es: "La lengua es un sistema porque todos sus elementos están relacionados entre sí y siguen unas normas.",
    am: "Լեզուն համակարգ է, որովհետև նրա բոլոր տարրերը կապված են միմյանց հետ և ենթարկվում են կանոնների։",
  },
  {
    id: "tc-10",
    es: "También es importante distinguir entre lengua, lenguaje y habla.",
    am: "Կարևոր է նաև տարբերել lenguaje, lengua և habla հասկացությունները։",
  },
  {
    id: "tc-11",
    es: "El lenguaje es la capacidad humana de comunicarse mediante signos.",
    am: "Lenguaje-ը մարդու՝ նշանների միջոցով հաղորդակցվելու ընդհանուր կարողությունն է։",
  },
  {
    id: "tc-12",
    es: "La lengua es el sistema concreto que utiliza una comunidad, por ejemplo, el español o el armenio.",
    am: "Lengua-ն որոշակի համայնքի կողմից օգտագործվող կոնկրետ լեզվական համակարգն է, օրինակ՝ իսպաներենը կամ հայերենը։",
  },
  {
    id: "tc-13",
    es: "El habla es la manera particular en que cada persona utiliza una lengua.",
    am: "Habla-ն այն ձևն է, որով յուրաքանչյուր մարդ անհատապես օգտագործում է լեզուն։",
  },
  {
    id: "tc-14",
    es: "En resumen, la lengua es un sistema organizado de signos y reglas que permite a las personas comunicarse.",
    am: "Ամփոփելով՝ լեզուն կազմակերպված նշանների և կանոնների համակարգ է, որը մարդկանց հնարավորություն է տալիս հաղորդակցվել։",
  },
];

export const TOPIC_SECTIONS: SectionData[] = [
  {
    id: "sec-1",
    number: "1",
    titleEs: "¿Por qué la lengua es un sistema?",
    titleAm: "Ինչո՞ւ է լեզուն համակարգ։",
    iconName: "Network",
    badge: "Հիմունքներ",
    items: [
      {
        id: "s1-1",
        es: "Porque sus elementos están relacionados y siguen unas reglas.",
        am: "Որովհետև նրա տարրերը կապված են միմյանց հետ և ենթարկվում են կանոնների։",
      },
      {
        id: "s1-2",
        es: "Los sonidos forman palabras, las palabras forman oraciones y las oraciones forman textos.",
        am: "Հնչյունները կազմում են բառեր, բառերը՝ նախադասություններ, իսկ նախադասությունները՝ տեքստեր։",
      },
    ],
  },
  {
    id: "sec-2",
    number: "2",
    titleEs: "Nivel fónico",
    titleAm: "Հնչյունական մակարդակ",
    iconName: "Volume2",
    badge: "Հնչյուններ",
    items: [
      {
        id: "s2-def",
        es: "Estudia los sonidos de la lengua.",
        am: "Ուսումնասիրում է լեզվի հնչյունները։",
        exampleEs: "Los sonidos /p/, /a/, /n/ pueden formar la palabra “pan”.",
        exampleAm: "/p/, /a/, /n/ հնչյունները կարող են կազմել «pan» բառը։",
      },
    ],
  },
  {
    id: "sec-3",
    number: "3",
    titleEs: "Nivel morfológico",
    titleAm: "Ձևաբանական մակարդակ",
    iconName: "Boxes",
    badge: "Կառուցվածք",
    items: [
      {
        id: "s3-def",
        es: "Estudia la estructura y la forma de las palabras.",
        am: "Ուսումնասիրում է բառերի ձևն ու կառուցվածքը։",
        exampleEs: "niño / niños",
        exampleAm: "երեխա / երեխաներ",
        noteEs: "La -s indica plural.",
        noteAm: "-s վերջավորությունը ցույց է տալիս հոգնակի թիվ։",
      },
    ],
  },
  {
    id: "sec-4",
    number: "4",
    titleEs: "Nivel sintáctico",
    titleAm: "Շարահյուսական մակարդակ",
    iconName: "GitMerge",
    badge: "Նախադասություն",
    items: [
      {
        id: "s4-def",
        es: "Estudia cómo se combinan las palabras en una oración.",
        am: "Ուսումնասիրում է, թե ինչպես են բառերը միավորվում նախադասության մեջ։",
        exampleEs: "Pedro estudia español.",
        exampleAm: "Պեդրոն իսպաներեն է սովորում։",
      },
    ],
  },
  {
    id: "sec-5",
    number: "5",
    titleEs: "Nivel semántico",
    titleAm: "Իմաստաբանական մակարդակ",
    iconName: "Sparkles",
    badge: "Իմաստ",
    items: [
      {
        id: "s5-def",
        es: "Estudia el significado de las palabras.",
        am: "Ուսումնասիրում է բառերի իմաստը։",
        exampleEs: "“Casa” significa un lugar donde vive una persona o una familia.",
        exampleAm: "«Casa» նշանակում է այն վայրը, որտեղ մարդը կամ ընտանիքն ապրում է։",
      },
    ],
  },
  {
    id: "sec-6",
    number: "6",
    titleEs: "Lenguaje, lengua y habla",
    titleAm: "Lenguaje, lengua և habla",
    iconName: "Users",
    badge: "3 Հասկացություն",
    items: [
      {
        id: "s6-lenguaje",
        label: "Lenguaje",
        labelAm: "Հաղորդակցվելու կարողություն",
        es: "Es la capacidad humana de comunicarse mediante signos.",
        am: "Դա մարդու՝ նշանների միջոցով հաղորդակցվելու կարողությունն է։",
      },
      {
        id: "s6-lengua",
        label: "Lengua",
        labelAm: "Լեզու",
        es: "Es un sistema de signos y reglas utilizado por una comunidad.",
        am: "Դա նշանների և կանոնների համակարգ է, որն օգտագործում է որոշակի համայնք։",
        exampleEs: "español, armenio, inglés.",
        exampleAm: "իսպաներեն, հայերեն, անգլերեն։",
      },
      {
        id: "s6-habla",
        label: "Habla",
        labelAm: "Խոսք",
        es: "Es la forma particular en que cada persona utiliza una lengua.",
        am: "Դա յուրաքանչյուր մարդու կողմից լեզվի անհատական օգտագործումն է։",
      },
    ],
  },
];

export const TABLA_MEMORIZAR: TableItem[] = [
  {
    id: "tab-1",
    nivel: "Fónico",
    nivelAm: "Հնչյունական",
    queEstudia: "Sonidos",
    queEstudiaAm: "Հնչյուններ",
    example: "sonidos /p/, /a/, /n/ → pan",
    exampleAm: "/p/, /a/, /n/ հնչյունները → pan",
  },
  {
    id: "tab-2",
    nivel: "Morfológico",
    nivelAm: "Ձևաբանական",
    queEstudia: "Forma de las palabras",
    queEstudiaAm: "Բառերի կառուցվածք",
    example: "niño → niños (-s = plural)",
    exampleAm: "երեխա → երեխաներ (-s = հոգնակի)",
  },
  {
    id: "tab-3",
    nivel: "Sintáctico",
    nivelAm: "Շարահյուսական",
    queEstudia: "Combinación de palabras",
    queEstudiaAm: "Բառերի կապ նախադասության մեջ",
    example: "Pedro estudia español.",
    exampleAm: "Պեդրոն իսպաներեն է սովորում։",
  },
  {
    id: "tab-4",
    nivel: "Semántico",
    nivelAm: "Իմաստաբանական",
    queEstudia: "Significado",
    queEstudiaAm: "Իմաստ",
    example: "“Casa” = lugar donde vive una familia",
    exampleAm: "«Casa» = վայր, որտեղ ընտանիքն է ապրում",
  },
];

export const PREGUNTAS_RESPUESTAS: QAItem[] = [
  {
    id: 1,
    questionEs: "¿Qué es la lengua?",
    questionAm: "Ի՞նչ է լեզուն։",
    answerEs: "Es un sistema de signos y reglas que utilizamos para comunicarnos.",
    answerAm: "Դա նշանների և կանոնների համակարգ է, որը օգտագործում ենք հաղորդակցվելու համար։",
    category: "Definición",
  },
  {
    id: 2,
    questionEs: "¿Por qué decimos que la lengua es un sistema?",
    questionAm: "Ինչո՞ւ ենք ասում, որ լեզուն համակարգ է։",
    answerEs: "Porque todos sus elementos están relacionados y siguen reglas.",
    answerAm: "Որովհետև նրա բոլոր տարրերը կապված են և ենթարկվում են կանոնների։",
    category: "Sistema",
  },
  {
    id: 3,
    questionEs: "¿Cuáles son los niveles principales de la lengua?",
    questionAm: "Որո՞նք են լեզվի հիմնական մակարդակները։",
    answerEs: "Fónico, morfológico, sintáctico y semántico.",
    answerAm: "Հնչյունական, ձևաբանական, շարահյուսական և իմաստաբանական։",
    category: "Niveles",
  },
  {
    id: 4,
    questionEs: "¿Qué estudia el nivel fónico?",
    questionAm: "Ի՞նչ է ուսումնասիրում հնչյունական մակարդակը։",
    answerEs: "Los sonidos de la lengua.",
    answerAm: "Լեզվի հնչյունները։",
    category: "Niveles",
  },
  {
    id: 5,
    questionEs: "¿Qué estudia el nivel morfológico?",
    questionAm: "Ի՞նչ է ուսումնասիրում ձևաբանական մակարդակը։",
    answerEs: "La forma y la estructura de las palabras.",
    answerAm: "Բառերի ձևն ու կառուցվածքը։",
    category: "Niveles",
  },
  {
    id: 6,
    questionEs: "¿Qué estudia el nivel sintáctico?",
    questionAm: "Ի՞նչ է ուսումնասիրում շարահյուսական մակարդակը։",
    answerEs: "Cómo se combinan las palabras para formar oraciones.",
    answerAm: "Թե ինչպես են բառերը միավորվում նախադասություններ կազմելու համար։",
    category: "Niveles",
  },
  {
    id: 7,
    questionEs: "¿Qué estudia el nivel semántico?",
    questionAm: "Ի՞նչ է ուսումնասիրում իմաստաբանական մակարդակը։",
    answerEs: "El significado de las palabras y expresiones.",
    answerAm: "Բառերի և արտահայտությունների իմաստը։",
    category: "Niveles",
  },
  {
    id: 8,
    questionEs: "¿Qué forman los sonidos?",
    questionAm: "Ի՞նչ են կազմում հնչյունները։",
    answerEs: "Forman palabras.",
    answerAm: "Կազմում են բառեր։",
    category: "Unidades",
  },
  {
    id: 9,
    questionEs: "¿Qué forman las palabras?",
    questionAm: "Ի՞նչ են կազմում բառերը։",
    answerEs: "Forman oraciones.",
    answerAm: "Կազմում են նախադասություններ։",
    category: "Unidades",
  },
  {
    id: 10,
    questionEs: "¿Qué pueden formar las oraciones?",
    questionAm: "Ի՞նչ կարող են կազմել նախադասությունները։",
    answerEs: "Pueden formar textos.",
    answerAm: "Կարող են կազմել տեքստեր։",
    category: "Unidades",
  },
  {
    id: 11,
    questionEs: "¿Qué es el lenguaje?",
    questionAm: "Ի՞նչ է lenguaje-ը։",
    answerEs: "Es la capacidad humana de comunicarse mediante signos.",
    answerAm: "Դա մարդու՝ նշաններով հաղորդակցվելու կարողությունն է։",
    category: "Lenguaje/Lengua/Habla",
  },
  {
    id: 12,
    questionEs: "¿Qué es la lengua?",
    questionAm: "Ի՞նչ է lengua-ն։",
    answerEs: "Es el sistema de signos y reglas de una comunidad.",
    answerAm: "Դա որոշակի համայնքի նշանների և կանոնների համակարգն է։",
    category: "Lenguaje/Lengua/Habla",
  },
  {
    id: 13,
    questionEs: "Da un ejemplo de lengua.",
    questionAm: "Բե՛ր lengua-ի օրինակ։",
    answerEs: "El español o el armenio.",
    answerAm: "Իսպաներենը կամ հայերենը։",
    category: "Ejemplos",
  },
  {
    id: 14,
    questionEs: "¿Qué es el habla?",
    questionAm: "Ի՞նչ է habla-ն։",
    answerEs: "Es la manera particular en que cada persona utiliza una lengua.",
    answerAm: "Դա յուրաքանչյուր մարդու կողմից լեզվի անհատական օգտագործման ձևն է։",
    category: "Lenguaje/Lengua/Habla",
  },
  {
    id: 15,
    questionEs: "¿Cuál es la diferencia entre lengua y habla?",
    questionAm: "Ո՞րն է lengua-ի և habla-ի տարբերությունը։",
    answerEs: "La lengua es un sistema compartido por una comunidad; el habla es el uso individual de ese sistema.",
    answerAm: "Lengua-ն համայնքի ընդհանուր լեզվական համակարգն է, իսկ habla-ն՝ այդ համակարգի անհատական օգտագործումը։",
    category: "Diferencia",
  },
];

export const TEXTO_CORTO = {
  titleEs: "Texto corto",
  titleAm: "Կարճ տեքստ՝",
  es: "La lengua es un sistema de signos y reglas que utilizamos para comunicarnos. Tiene diferentes niveles: fónico, que estudia los sonidos; morfológico, que estudia las palabras; sintáctico, que estudia cómo se combinan las palabras; y semántico, que estudia su significado. También debemos distinguir entre lenguaje, lengua y habla. El lenguaje es la capacidad de comunicarse, la lengua es el sistema que utiliza una comunidad y el habla es la forma particular en que cada persona usa ese sistema.",
  am: "Լեզուն նշանների և կանոնների համակարգ է, որը մենք օգտագործում ենք հաղորդակցվելու համար։ Այն ունի տարբեր մակարդակներ՝ հնչյունական, որը ուսումնասիրում է հնչյունները, ձևաբանական՝ բառերի կառուցվածքը, շարահյուսական՝ բառերի միացումը նախադասության մեջ, և իմաստաբանական՝ բառերի իմաստը։ Պետք է նաև տարբերել lenguaje, lengua և habla հասկացությունները։ Lenguaje-ը հաղորդակցվելու կարողությունն է, lengua-ն համայնքի օգտագործած լեզվական համակարգը, իսկ habla-ն այդ համակարգի անհատական օգտագործումն է։",
  points: [
    {
      es: "La lengua es un sistema de signos y reglas que utilizamos para comunicarnos.",
      am: "Լեզուն նշանների և կանոնների համակարգ է, որը մենք օգտագործում ենք հաղորդակցվելու համար։",
    },
    {
      es: "Tiene diferentes niveles: fónico, que estudia los sonidos; morfológico, que estudia las palabras; sintáctico, que estudia cómo se combinan las palabras; y semántico, que estudia su significado.",
      am: "Այն ունի տարբեր մակարդակներ՝ հնչյունական, որը ուսումնասիրում է հնչյունները, ձևաբանական՝ բառերի կառուցվածքը, շարահյուսական՝ բառերի միացումը նախադասության մեջ, և իմաստաբանական՝ բառերի իմաստը։",
    },
    {
      es: "También debemos distinguir entre lenguaje, lengua y habla. El lenguaje es la capacidad de comunicarse, la lengua es el sistema que utiliza una comunidad y el habla es la forma particular en que cada persona usa ese sistema.",
      am: "Պետք է նաև տարբերել lenguaje, lengua և habla հասկացությունները։ Lenguaje-ը հաղորդակցվելու կարողությունն է, lengua-ն համայնքի օգտագործած լեզվական համակարգը, իսկ habla-ն այդ համակարգի անհատական օգտագործումն է։",
    },
  ],
};

export const VOCABULARY_LIST = [
  { es: "La lengua", am: "Լեզու (լեզվական համակարգ)", tag: "Կոնցեպտ" },
  { es: "El lenguaje", am: "Խոսելու/հաղորդակցվելու կարողություն", tag: "Կոնցեպտ" },
  { es: "El habla", am: "Խոսք (անհատական օգտագործում)", tag: "Կոնցեպտ" },
  { es: "El sistema", am: "Համակարգ", tag: "Տերմին" },
  { es: "Los signos", am: "Նշաններ", tag: "Տերմին" },
  { es: "Las reglas", am: "Կանոններ", tag: "Տերմին" },
  { es: "Nivel fónico", am: "Հնչյունական մակարդակ", tag: "Մակարդակ" },
  { es: "Nivel morfológico", am: "Ձևաբանական մակարդակ", tag: "Մակարդակ" },
  { es: "Nivel sintáctico", am: "Շարահյուսական մակարդակ", tag: "Մակարդակ" },
  { es: "Nivel semántico", am: "Իմաստաբանական մակարդակ", tag: "Մակարդակ" },
  { es: "Los sonidos", am: "Հնչյուններ", tag: "Միավոր" },
  { es: "Las palabras", am: "Բառեր", tag: "Միավոր" },
  { es: "Las oraciones", am: "Նախադասություններ", tag: "Միավոր" },
  { es: "Los textos", am: "Տեքստեր", tag: "Միավոր" },
  { es: "La comunidad", am: "Համայնք / հասարակություն", tag: "Հասկացություն" },
];
