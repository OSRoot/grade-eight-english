/* ===== Foundation Vocabulary (EN ↔ AR) ===== */
const VOCAB = [
  // Nouns
  { en: "school", ar: "مدرسة", type: "noun", def: "A place where students learn." },
  { en: "teacher", ar: "مُعلِّم/ـة", type: "noun", def: "A person who teaches students." },
  { en: "student", ar: "طالب/ـة", type: "noun", def: "A person who studies." },
  { en: "book", ar: "كتاب", type: "noun", def: "Pages with information to read." },
  { en: "pen", ar: "قلم حبر", type: "noun", def: "A tool used for writing." },
  { en: "pencil", ar: "قلم رصاص", type: "noun", def: "A wooden writing tool." },
  { en: "house", ar: "منزل", type: "noun", def: "A place where people live." },
  { en: "family", ar: "عائلة", type: "noun", def: "Parents and children together." },
  { en: "friend", ar: "صديق/ـة", type: "noun", def: "A person you like and trust." },
  { en: "city", ar: "مدينة", type: "noun", def: "A large area where many people live." },
  { en: "country", ar: "دولة / بلد", type: "noun", def: "A nation with its own government." },
  { en: "food", ar: "طعام", type: "noun", def: "Things we eat." },
  { en: "water", ar: "ماء", type: "noun", def: "A liquid we drink." },
  { en: "time", ar: "وقت", type: "noun", def: "Hours, minutes, seconds." },
  { en: "day", ar: "يوم", type: "noun", def: "24 hours; opposite of night." },
  { en: "year", ar: "سنة", type: "noun", def: "12 months." },

  // Verbs
  { en: "be", ar: "يكون", type: "verb", def: "To exist; am/is/are." },
  { en: "have", ar: "يملك / لديه", type: "verb", def: "To own or possess." },
  { en: "do", ar: "يفعل", type: "verb", def: "To perform an action." },
  { en: "go", ar: "يذهب", type: "verb", def: "To move to another place." },
  { en: "come", ar: "يأتي", type: "verb", def: "To arrive at a place." },
  { en: "eat", ar: "يأكل", type: "verb", def: "To put food in the mouth." },
  { en: "drink", ar: "يشرب", type: "verb", def: "To take a liquid into the mouth." },
  { en: "study", ar: "يدرس", type: "verb", def: "To learn by reading and thinking." },
  { en: "play", ar: "يلعب", type: "verb", def: "To enjoy a game or sport." },
  { en: "read", ar: "يقرأ", type: "verb", def: "To look at words and understand them." },
  { en: "write", ar: "يكتب", type: "verb", def: "To make letters or words." },
  { en: "speak", ar: "يتحدث", type: "verb", def: "To say words." },
  { en: "listen", ar: "يستمع", type: "verb", def: "To hear carefully." },
  { en: "watch", ar: "يشاهد", type: "verb", def: "To look at carefully." },
  { en: "see", ar: "يرى", type: "verb", def: "To use your eyes." },
  { en: "buy", ar: "يشتري", type: "verb", def: "To get something for money." },

  // Adjectives
  { en: "big", ar: "كبير", type: "adjective", def: "Large in size." },
  { en: "small", ar: "صغير", type: "adjective", def: "Little; not big." },
  { en: "good", ar: "جيّد", type: "adjective", def: "Pleasant; not bad." },
  { en: "bad", ar: "سيّئ", type: "adjective", def: "Not good." },
  { en: "happy", ar: "سعيد", type: "adjective", def: "Feeling joy." },
  { en: "sad", ar: "حزين", type: "adjective", def: "Feeling unhappy." },
  { en: "new", ar: "جديد", type: "adjective", def: "Made or bought recently." },
  { en: "old", ar: "قديم / كبير في السن", type: "adjective", def: "Not new." },
  { en: "fast", ar: "سريع", type: "adjective", def: "Moving quickly." },
  { en: "slow", ar: "بطيء", type: "adjective", def: "Not fast." },
  { en: "easy", ar: "سهل", type: "adjective", def: "Not difficult." },
  { en: "difficult", ar: "صعب", type: "adjective", def: "Not easy." },

  // Time words
  { en: "today", ar: "اليوم", type: "time", def: "This day." },
  { en: "tomorrow", ar: "غدًا", type: "time", def: "The day after today." },
  { en: "yesterday", ar: "أمس", type: "time", def: "The day before today." },
  { en: "now", ar: "الآن", type: "time", def: "At this moment." },
  { en: "then", ar: "حينئذٍ / بعد ذلك", type: "time", def: "At that time." },
  { en: "always", ar: "دائمًا", type: "time", def: "All the time." },
  { en: "usually", ar: "عادةً", type: "time", def: "Most of the time." },
  { en: "sometimes", ar: "أحيانًا", type: "time", def: "From time to time." },
  { en: "never", ar: "أبدًا", type: "time", def: "Not at any time." },
  { en: "every day", ar: "كل يوم", type: "time", def: "Daily." },
  { en: "last week", ar: "الأسبوع الماضي", type: "time", def: "The week before this one." },
  { en: "next week", ar: "الأسبوع القادم", type: "time", def: "The week after this one." },
  { en: "ago", ar: "منذ", type: "time", def: "Used for past time." },

  // Numbers
  { en: "one", ar: "واحد", type: "number" },
  { en: "two", ar: "اثنان", type: "number" },
  { en: "three", ar: "ثلاثة", type: "number" },
  { en: "four", ar: "أربعة", type: "number" },
  { en: "five", ar: "خمسة", type: "number" },
  { en: "ten", ar: "عشرة", type: "number" },
  { en: "twenty", ar: "عشرون", type: "number" },
  { en: "hundred", ar: "مئة", type: "number" },

  // Question words
  { en: "what", ar: "ماذا / ما", type: "qword", def: "Asks about a thing." },
  { en: "where", ar: "أين", type: "qword", def: "Asks about a place." },
  { en: "when", ar: "متى", type: "qword", def: "Asks about time." },
  { en: "who", ar: "من", type: "qword", def: "Asks about a person." },
  { en: "why", ar: "لماذا", type: "qword", def: "Asks for a reason." },
  { en: "how", ar: "كيف", type: "qword", def: "Asks about a way." },
  { en: "which", ar: "أيّ", type: "qword", def: "Asks for a choice." },
  { en: "how many", ar: "كم (للمعدود)", type: "qword", def: "Asks for a countable number." },
  { en: "how much", ar: "كم (للمعدود وغير المعدود)", type: "qword", def: "Asks for an amount or price." },
];

/* ===== Words for "count vowels" game ===== */
const COUNT_WORDS = [
  { word: "school", vowels: 2 },
  { word: "education", vowels: 5 },
  { word: "language", vowels: 4 },
  { word: "happy", vowels: 1 },
  { word: "yesterday", vowels: 3 },
  { word: "beautiful", vowels: 5 },
  { word: "teacher", vowels: 3 },
  { word: "computer", vowels: 3 },
];

/* ===== Tense identification game ===== */
const TENSE_QS = [
  { sentence: "She plays tennis every Friday.", correct: "present-simple", options: ["present-simple","present-continuous","past-simple","future"] },
  { sentence: "I am reading a book now.", correct: "present-continuous", options: ["present-simple","present-continuous","past-simple","future"] },
  { sentence: "We visited Cairo last summer.", correct: "past-simple", options: ["present-simple","past-simple","past-continuous","future"] },
  { sentence: "They will travel tomorrow.", correct: "future", options: ["past-simple","present-continuous","future","imperative"] },
  { sentence: "Open the door, please.", correct: "imperative", options: ["present-simple","imperative","past-simple","future"] },
  { sentence: "He was watching TV at 8 pm.", correct: "past-continuous", options: ["past-simple","past-continuous","present-continuous","future"] },
  { sentence: "I am going to study hard.", correct: "future", options: ["present-continuous","future","past-simple","imperative"] },
  { sentence: "Don't run in the corridor.", correct: "imperative", options: ["imperative","present-simple","future","past-simple"] },
];

const TENSE_LABELS = {
  "present-simple": "Present Simple — مضارع بسيط",
  "present-continuous": "Present Continuous — مضارع مستمر",
  "past-simple": "Past Simple — ماضي بسيط",
  "past-continuous": "Past Continuous — ماضي مستمر",
  "future": "Future — مستقبل",
  "imperative": "Imperative — أمر"
};

/* ===== Final test bank ===== */
const FINAL_TEST = [
  {
    q: "How many vowels are in the word \"university\"?",
    options: [{v:"a", t:"3"},{v:"b", t:"4"},{v:"c", t:"5"},{v:"d", t:"6"}],
    correct: "b"
  },
  {
    q: "____ is my brother. He is twelve years old.",
    options: [{v:"a", t:"She"},{v:"b", t:"It"},{v:"c", t:"He"},{v:"d", t:"They"}],
    correct: "c"
  },
  {
    q: "Look at ____ stars in the sky tonight!",
    options: [{v:"a", t:"this"},{v:"b", t:"that"},{v:"c", t:"these"},{v:"d", t:"those"}],
    correct: "d"
  },
  {
    q: "My mother ____ breakfast every morning.",
    options: [{v:"a", t:"cook"},{v:"b", t:"cooks"},{v:"c", t:"cooking"},{v:"d", t:"cooked"}],
    correct: "b"
  },
  {
    q: "Listen! The baby ____.",
    options: [{v:"a", t:"cry"},{v:"b", t:"cries"},{v:"c", t:"is crying"},{v:"d", t:"cried"}],
    correct: "c"
  },
  {
    q: "We ____ to the zoo last Friday.",
    options: [{v:"a", t:"go"},{v:"b", t:"goes"},{v:"c", t:"going"},{v:"d", t:"went"}],
    correct: "d"
  },
  {
    q: "Tomorrow, I ____ my grandparents.",
    options: [{v:"a", t:"visit"},{v:"b", t:"visited"},{v:"c", t:"will visit"},{v:"d", t:"was visiting"}],
    correct: "c"
  },
  {
    q: "____ quiet, please. The baby is sleeping.",
    options: [{v:"a", t:"You are"},{v:"b", t:"Be"},{v:"c", t:"Being"},{v:"d", t:"Were"}],
    correct: "b"
  },
  {
    q: "Sara said, \"I am happy today.\" → Sara said that ____.",
    options: [
      {v:"a", t:"she is happy today"},
      {v:"b", t:"she was happy that day"},
      {v:"c", t:"I am happy today"},
      {v:"d", t:"she will be happy that day"}
    ],
    correct: "b"
  },
  {
    q: "The teacher said, \"You will have a test tomorrow.\" → The teacher said that we ____ a test ____.",
    options: [
      {v:"a", t:"will have / tomorrow"},
      {v:"b", t:"would have / the next day"},
      {v:"c", t:"have / tomorrow"},
      {v:"d", t:"had / yesterday"}
    ],
    correct: "b"
  },
];

/* ===== I18N ===== */
const I18N = {
  ar: {
    "brand.title": "مراجعة الأستاذ أسامة",
    "brand.sub": "MR Osama Revision · أساسيات اللغة الإنجليزية",
    "nav.s1": "١. الحروف", "nav.s2": "٢. الضمائر",
    "nav.s3": "٣. مفردات وأفعال", "nav.s4": "٤. الأزمنة",
    "nav.s5": "٥. الكلام المنقول", "nav.test": "الاختبار النهائي",

    "hero.kicker": "📅 الحصة الأولى — ٠٢/٠٥/٢٠٢٦",
    "hero.title": "مراجعة شاملة<br>في أساسيات اللغة الإنجليزية",
    "hero.lead": "رحلة تأسيسية تفاعلية تبدأ من الحروف وتنتهي بالكلام المنقول — مع شرح بالعربية، أمثلة عملية، وألعاب ذكاء لكل قسم.",
    "hero.start": "▶ ابدأ المراجعة",
    "hero.test": "📝 اختبر نفسك",
    "hero.sections": "أقسام", "hero.games": "لعبة وتمرين",
    "hero.words": "كلمة شائعة", "hero.bilingual": "شرح ثنائي",
    "hero.progress": "تقدّمك في المراجعة",

    "index.title": "الفهرس · Index",
    "index.s1": "الحروف", "index.s2": "الضمائر وأسماء الإشارة",
    "index.s3": "مفردات وأفعال أساسية", "index.s4": "الأزمنة",
    "index.s5": "الكلام المباشر والمنقول", "index.test": "الاختبار النهائي",

    "test.title": "الاختبار النهائي · Final Test",
    "test.sub": "١٠ أسئلة من جميع الأقسام",
    "footer.note": "صُمِّم لتعلّم تفاعلي ثنائي اللغة (عربي/إنجليزي).",
  },
  en: {
    "brand.title": "MR Osama Revision",
    "brand.sub": "MR Osama Revision · English Foundations",
    "nav.s1": "1. Letters", "nav.s2": "2. Pronouns",
    "nav.s3": "3. Vocabulary", "nav.s4": "4. Tenses",
    "nav.s5": "5. Reported Speech", "nav.test": "Final Test",

    "hero.kicker": "📅 Class One — 02/05/2026",
    "hero.title": "Comprehensive Revision<br>in English Foundations",
    "hero.lead": "An interactive foundation journey from letters to reported speech — with Arabic explanations, real examples, and a smart game for every section.",
    "hero.start": "▶ Start Revision",
    "hero.test": "📝 Self-Test",
    "hero.sections": "Sections", "hero.games": "Games & Drills",
    "hero.words": "Common Words", "hero.bilingual": "Bilingual",
    "hero.progress": "Your revision progress",

    "index.title": "Index · الفهرس",
    "index.s1": "Letters", "index.s2": "Pronouns & Demonstratives",
    "index.s3": "Foundation Vocabulary", "index.s4": "Tenses",
    "index.s5": "Direct & Reported Speech", "index.test": "Final Test",

    "test.title": "Final Test · الاختبار النهائي",
    "test.sub": "10 questions from all sections",
    "footer.note": "Made for interactive bilingual learning (AR/EN).",
  }
};
