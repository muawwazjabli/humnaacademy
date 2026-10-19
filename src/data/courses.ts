import { Course } from "@/types";

export const COURSES: Course[] = [
  {
    id: "quran-reading",
    slug: "quran-reading",
    title: "Quran Reading Course (Nazra)",
    titleUrdu: "ناظرہ قرآن کریم",
    category: "Foundation",
    level: "Beginner",
    featured: true,
    iconName: "BookOpen",
    shortDescription: "Master fluent Quran reading with correct Arabic letter recognition, joining rules, and authentic articulation.",
    fullOverview: "The Quran Reading Course is tailored for students of all ages who want to learn how to read the Holy Quran accurately from the text (Nazra). Whether starting after completing a Qaida or needing to transition smoothly into the Mus'haf, this course builds steady word-by-word fluency, proper phonetic sounds, and confidence in recitation.",
    targetAudience: [
      "Children who have completed foundational Qaida lessons.",
      "Adult beginners who want to read the Quran directly with proper pronunciation.",
      "Students seeking to improve reading pace and eliminate hesitation."
    ],
    learningObjectives: [
      "Recognize Arabic letters in all compound and isolated forms.",
      "Apply primary vowels (Harakat), Tanween, Sukoon, and Madd correctly.",
      "Transition from reading words to continuous verses smoothly.",
      "Achieve independent recitation of the Holy Quran."
    ],
    curriculum: [
      {
        weekOrModule: "Module 1",
        title: "Transition to Mus'haf & Juz Amma (Juz 30)",
        topics: ["Short Surahs recitation", "Connecting letters across words", "Word-by-word guidance"]
      },
      {
        weekOrModule: "Module 2",
        title: "Recitation Mechanics & Stopping Signs (Waqf)",
        topics: ["Understanding basic stopping symbols", "Breath control techniques", "Avoiding common phonological mistakes"]
      },
      {
        weekOrModule: "Module 3",
        title: "Extended Reading & Fluency Building",
        topics: ["Reading longer passages from Juz Tabarak and Juz 1", "Self-correction strategies", "Rhythmic recitation practice"]
      }
    ],
    prerequisites: "Basic familiarity with Arabic letters or completion of a foundational Qaida.",
    suggestedLessonStructure: "30-minute one-to-one session: 5 min previous review, 20 min new lesson reading, 5 min teacher correction & homework setting.",
    durationFrequency: "Customizable (recommended 3 to 5 classes per week, 30 minutes each).",
    faqs: [
      {
        question: "How long does it take to complete the entire Quran recitation?",
        answer: "The duration varies depending on the student's age, practice frequency, and lesson count (typically between 6 to 18 months of regular classes)."
      },
      {
        question: "Can an adult beginner join this course directly?",
        answer: "Yes, our instructors assess your current level in the free trial and tailor the starting point accordingly."
      }
    ]
  },
  {
    id: "noorani-qaida",
    slug: "noorani-qaida",
    title: "Noorani Qaida Course",
    titleUrdu: "نورانی قاعدہ",
    category: "Foundation",
    level: "Beginner",
    featured: true,
    iconName: "GraduationCap",
    shortDescription: "The gold standard primer for young learners and beginners to learn Arabic alphabets, vowels, and phonetics step-by-step.",
    fullOverview: "Noorani Qaida is the most widely recognized foundational booklet for learning Quranic Arabic reading worldwide. This course guides beginners through single letters, compound letters (Murakkabat), movements (Harakat), Tanween, rules of Nun Sakinah, Meem Sakinah, and Maddah letters.",
    targetAudience: [
      "Young children starting their Quranic education.",
      "Adults with zero background in Arabic letters.",
      "Reverts and non-Arabic speakers looking for a systematic phonetic approach."
    ],
    learningObjectives: [
      "Master all 29 Arabic alphabet sounds from their exact points of articulation.",
      "Understand letter connections at the beginning, middle, and end of words.",
      "Accurately pronounce short and long vowels, Sukoon, Tashdeed, and Tanween.",
      "Build readiness for direct Quranic recitation."
    ],
    curriculum: [
      {
        weekOrModule: "Stage 1",
        title: "Individual Letters & Compound Forms",
        topics: ["Al-Mufradat (Single letters)", "Al-Murakkabat (Combined letters)", "Phonetic differentiation"]
      },
      {
        weekOrModule: "Stage 2",
        title: "Vowel Movements & Marks",
        topics: ["Harakat (Fathah, Kasrah, Dammah)", "Tanween (Double vowels)", "Letters of Maddah & Leen"]
      },
      {
        weekOrModule: "Stage 3",
        title: "Advanced Signs & Transition Exercises",
        topics: ["Sukoon & Jazm", "Tashdeed (Shaddah)", "Nun and Meem Mushaddad", "Final reading exercises"]
      }
    ],
    prerequisites: "None. Suitable for absolute beginners.",
    suggestedLessonStructure: "25-30 minute session focusing on repetition, listening, interactive correction, and audio drill.",
    durationFrequency: "Typically 2 to 4 months based on attendance and student retention.",
    faqs: [
      {
        question: "What is the recommended age for a child to start Noorani Qaida?",
        answer: "Children typically start around age 4 to 5, but lessons are fully adapted to the child's attention span."
      }
    ]
  },
  {
    id: "rahmani-qaida",
    slug: "rahmani-qaida",
    title: "Rahmani Qaida Course",
    titleUrdu: "رحمانی قاعدہ",
    category: "Foundation",
    level: "Beginner",
    featured: false,
    iconName: "BookOpenCheck",
    shortDescription: "A structured, easy-to-follow primer designed to simplify Quranic phonetics and letter joining.",
    fullOverview: "Rahmani Qaida provides a clean, methodical progression tailored to students who thrive with visual simplicity and gradual phonetic exercises. It is specifically beneficial for students desiring gentle, steady progression into Arabic word formation.",
    targetAudience: [
      "Children and young learners who benefit from spaced, clear typography.",
      "Students looking for an alternative curriculum suited to their learning pace."
    ],
    learningObjectives: [
      "Recognize Arabic letters in distinct script styles.",
      "Gradually master Harakat and letter blends.",
      "Learn foundational pronunciation rules before starting the Mus'haf."
    ],
    curriculum: [
      {
        weekOrModule: "Section 1",
        title: "Letters & Articulations",
        topics: ["Basic alphabets", "Letter shapes in words", "Makharij fundamentals"]
      },
      {
        weekOrModule: "Section 2",
        title: "Vowels & Connecting Rules",
        topics: ["Short vowels", "Tanween drills", "Silent and pronounced letters"]
      }
    ],
    prerequisites: "None.",
    suggestedLessonStructure: "30-minute one-to-one interactive reading practice.",
    durationFrequency: "Flexible; academy configures scheduling based on student needs.",
    faqs: [
      {
        question: "How does Rahmani Qaida differ from Noorani Qaida?",
        answer: "Both cover the essential foundational rules of Quranic reading; the layout and step-by-step exercise arrangements vary according to regional preferences."
      }
    ]
  },
  {
    id: "madani-qaida",
    slug: "madani-qaida",
    title: "Madani Qaida Course",
    titleUrdu: "مدنی قاعدہ",
    category: "Foundation",
    level: "Beginner",
    featured: false,
    iconName: "Bookmark",
    shortDescription: "A comprehensive primer popular across South Asia and global communities with thorough Tajweed explanations.",
    fullOverview: "Madani Qaida is widely acclaimed for its detailed explanations of Tajweed rules alongside basic Arabic reading exercises. It provides clear color-coded guides and rules for heavy and light letters, Ghunnah, and Ikhfa from the earliest stages.",
    targetAudience: [
      "Beginners wanting in-depth rule explanations alongside phonetics.",
      "Children and adults enrolled in community-oriented Quran learning."
    ],
    learningObjectives: [
      "Clear pronunciation of Tafkheem (heavy) and Tarqeeq (light) letters.",
      "Understand introductory Tajweed terms in a simple, practical manner.",
      "Read Quranic vocabulary accurately with Tajweed rules applied."
    ],
    curriculum: [
      {
        weekOrModule: "Part 1",
        title: "Phonetics & Articulation Points",
        topics: ["29 Huruf Mufradat", "Huruf Murakkabat", "Makharij drills"]
      },
      {
        weekOrModule: "Part 2",
        title: "Rules & Practical Exercises",
        topics: ["Harakat, Tanween, Huruf Maddah", "Rules of Raa and Laam", "End of Qaida examination"]
      }
    ],
    prerequisites: "None.",
    suggestedLessonStructure: "30-minute sessions with emphasis on practical Tajweed drills.",
    durationFrequency: "Configurable by the academy.",
    faqs: [
      {
        question: "Can students choose between Noorani and Madani Qaida?",
        answer: "Yes, students or parents can specify their preferred Qaida curriculum when booking."
      }
    ]
  },
  {
    id: "baghdadi-qaida",
    slug: "baghdadi-qaida",
    title: "Baghdadi Qaida Course",
    titleUrdu: "بغدادی قاعدہ",
    category: "Foundation",
    level: "Beginner",
    featured: false,
    iconName: "ScrollText",
    shortDescription: "Traditional, time-tested foundational primer used for generations in classical Quranic learning.",
    fullOverview: "Baghdadi Qaida is one of the classical primers historically utilized across the Islamic world. It features a classical pedagogical progression that emphasizes phonetic discipline, syllable rhythmic repetition, and classical orthography.",
    targetAudience: [
      "Learners who prefer classical traditional teaching methodologies.",
      "Families seeking a traditional instructional foundation."
    ],
    learningObjectives: [
      "Master the traditional Baghdadi spelling method (Hijaa).",
      "Develop rapid recognition of compound letter configurations.",
      "Build rigorous pronunciation accuracy."
    ],
    curriculum: [
      {
        weekOrModule: "Unit 1",
        title: "Classical Letter Foundation",
        topics: ["Alphabetic inventory", "Traditional spelling rhythm", "Vocal positioning"]
      },
      {
        weekOrModule: "Unit 2",
        title: "Syllabic Blending",
        topics: ["Two-letter and three-letter compounds", "Long vowels & diphthongs", "Quranic text synthesis"]
      }
    ],
    prerequisites: "None.",
    suggestedLessonStructure: "30-minute structured recitation lessons.",
    durationFrequency: "Configurable by the academy.",
    faqs: [
      {
        question: "Is this course suitable for young children?",
        answer: "Yes, under patient one-to-one guidance from qualified teachers."
      }
    ]
  },
  {
    id: "tajweed-ul-quran",
    slug: "tajweed-ul-quran",
    title: "Tajweed-ul-Quran Course",
    titleUrdu: "تجوید القرآن الکریم",
    category: "Recitation & Rules",
    level: "Intermediate",
    featured: true,
    iconName: "Sparkles",
    shortDescription: "Master the authentic science of Quranic recitation, including Makharij, Sifaat, and detailed Tajweed laws.",
    fullOverview: "Reciting the Quran with Tajweed is an obligation for every Muslim seeking to preserve the divine words as revealed to Prophet Muhammad (peace be upon him). This course provides theoretical knowledge and intensive practical application of articulation points (Makharij), intrinsic characteristics (Sifaat), rules of Nun Sakinah, Meem Sakinah, Mudood (prolongations), and stopping rules (Waqf).",
    targetAudience: [
      "Students who can already read the Quran but want to correct their pronunciation.",
      "Adults seeking to beautify their recitation and eliminate hidden flaws (Lahn Khafi).",
      "Those preparing for Hifz or advanced Quranic studies."
    ],
    learningObjectives: [
      "Articulate all 17 Makharij with precision.",
      "Differentiate letters with opposing Sifaat (Hams vs Jahr, Shiddah vs Rakhawah, etc.).",
      "Master all 4 rules of Nun Sakinah and Tanween (Izhar, Idgham, Iqlab, Ikhfa).",
      "Eliminate major mistakes (Lahn Jali) and subtle flaws (Lahn Khafi)."
    ],
    curriculum: [
      {
        weekOrModule: "Module 1",
        title: "Makharij & Sifaat Al-Huruf",
        topics: ["Points of articulation (Throat, Tongue, Lips, Nasal cavity)", "Permanent and temporary characteristics", "Tafkheem and Tarqeeq"]
      },
      {
        weekOrModule: "Module 2",
        title: "Rules of Nun Sakinah, Meem Sakinah & Mudood",
        topics: ["Izhar, Idgham, Iqlab, Ikhfa rules with Quranic examples", "Rules of Meem Sakinah & Laam Shamsiyyah/Qamariyyah", "Types and lengths of Mudood"]
      },
      {
        weekOrModule: "Module 3",
        title: "Rules of Waqf, Ibtida & Practical Recitation",
        topics: ["Types of stopping (Tam, Kafi, Hasan, Qabih)", "Hamzatul Wasl rules", "Surah-by-Surah practical correction"]
      }
    ],
    prerequisites: "Ability to read Quranic Arabic script (basic Nazra fluency).",
    suggestedLessonStructure: "30-45 minute sessions divided into 15 min rule discussion and 25 min live recitation correction.",
    durationFrequency: "Recommended 3 to 4 classes per week for 6 months.",
    faqs: [
      {
        question: "Will I receive feedback during every class?",
        answer: "Yes, every one-to-one class includes real-time correction of your pronunciation and Tajweed application."
      }
    ]
  },
  {
    id: "hifz-ul-quran",
    slug: "hifz-ul-quran",
    title: "Hifz-ul-Quran (Memorization)",
    titleUrdu: "حفظ القرآن الکریم",
    category: "Memorization",
    level: "Intermediate",
    featured: true,
    iconName: "ShieldCheck",
    shortDescription: "A structured, personalized Quran memorization program with daily lessons (Sabaq), revision (Sabqi), and retention tracking.",
    fullOverview: "Memorizing the Holy Quran is a blessed lifelong honor. Humna Academy offers a dedicated Hifz track structured around the classical threefold memorization cycle: Sabaq (new daily memorization), Sabqi (recent revision), and Manzil (cumulative retention across earlier completed Juz). Guided by experienced Huffaz, students progress according to their individual memory retention capabilities.",
    targetAudience: [
      "Dedicated children and youth aiming to complete full Quran memorization.",
      "Adults wishing to memorize selected Surahs (e.g., Al-Baqarah, Yaseen, Al-Mulk, Al-Kahf) or complete Juz.",
      "Existing Huffaz requiring structured daily revision (Daur) to strengthen retention."
    ],
    learningObjectives: [
      "Memorize assigned Quranic portions with immaculate Tajweed.",
      "Establish a robust daily revision routine to retain memorized verses.",
      "Develop strong concentration, vocal discipline, and spiritual connection."
    ],
    curriculum: [
      {
        weekOrModule: "Phase 1",
        title: "Foundation & Juz Amma (Juz 30)",
        topics: ["Assessment of Tajweed & reading speed", "Daily Sabaq routine establishment", "Short Surahs memorization"]
      },
      {
        weekOrModule: "Phase 2",
        title: "Core Memorization & Sabqi System",
        topics: ["Daily Sabaq (half page to full page)", "Sabqi (last 5-10 pages daily)", "Manzil (quarter Juz or half Juz daily)"]
      },
      {
        weekOrModule: "Phase 3",
        title: "Consolidation & Full Daur",
        topics: ["Systematic revision of completed portions", "Mutual testing and retention reinforcement"]
      }
    ],
    prerequisites: "Fluent Quran reading with verified Tajweed rules.",
    suggestedLessonStructure: "45-60 minute sessions: 15 min Sabqi recitation, 15 min new Sabaq memorization check, 15 min Manzil revision.",
    durationFrequency: "4 to 6 classes per week strongly recommended for consistent memorization progress.",
    faqs: [
      {
        question: "Can students memorize partial Quran (e.g. 5 Juz or selected Surahs)?",
        answer: "Yes! We offer customized memorization tracks for selected Surahs as well as full Hifz programs."
      }
    ]
  },
  {
    id: "ijazah-course",
    slug: "ijazah-course",
    title: "Ijazah Preparation Course",
    titleUrdu: "دورة الإجازة القرآنية",
    category: "Advanced Studies",
    level: "Advanced",
    featured: false,
    iconName: "Award",
    shortDescription: "Advanced Quran recitation and transmission studies with verified sanad requirements and rigorous evaluation standards.",
    fullOverview: "The Ijazah program is an advanced academic and spiritual milestone designed for serious students of the Quran who wish to master recitation according to classical transmission lines (Sanad connected to the Prophet ﷺ). This course focuses on exhaustive Tajweed mastery, error-free recitation of the entire Quran from memory or Mus'haf, and mastery of classical texts like Al-Jazariyyah.",
    targetAudience: [
      "Advanced reciters and Huffaz aiming to attain formal Ijazah with Sanad.",
      "Teachers and scholars who want formal certification in Quranic recitation."
    ],
    learningObjectives: [
      "Recite the entire Quran without a single phonological or Tajweed flaw.",
      "Master the theoretical rules of Mandhumat al-Jazariyyah.",
      "Demonstrate comprehensive mastery of stopping, starting, and orthography."
    ],
    curriculum: [
      {
        weekOrModule: "Stage 1",
        title: "Advanced Tajweed Theory & Examination",
        topics: ["Study of Matn Al-Jazariyyah", "Deep-dive into Sifaat, Waqf, and Ibtida", "Initial vocal assessment"]
      },
      {
        weekOrModule: "Stage 2",
        title: "Khatmah Recitation (The Complete Reading)",
        topics: ["Sequential recitation of all 30 Juz before an authorized Sheikh/Shaykhah", "Rigorous live correction and note-taking"]
      },
      {
        weekOrModule: "Stage 3",
        title: "Oral Defense & Verification",
        topics: ["Final oral assessment on theoretical Tajweed", "Sanad conditions review"]
      }
    ],
    prerequisites: "Fluent recitation with advanced Tajweed. Prior screening and entrance evaluation required.",
    suggestedLessonStructure: "45-60 minute one-to-one recitation under direct supervision.",
    durationFrequency: "Determined upon entrance assessment; requires consistent long-term commitment.",
    verifiedNote: "Notice: Humna Academy adheres to the highest standards of Quranic transmission. Ijazah is awarded strictly upon verified completion of full Khatmah and examination by an authorized holder of authentic Sanad.",
    faqs: [
      {
        question: "Is Ijazah guaranteed upon enrolling in the course?",
        answer: "No. In accordance with authentic Islamic traditions, Ijazah is granted only when the student satisfies all rigorous recitation and theoretical criteria."
      }
    ]
  },
  {
    id: "ten-qiraat",
    slug: "ten-qiraat",
    title: "Ten Qira'at Course",
    titleUrdu: "العشر قراءات",
    category: "Advanced Studies",
    level: "Advanced",
    featured: false,
    iconName: "Library",
    shortDescription: "Rigorous study of recognized canonical Qira'at and their authentic transmissions (Riwayat).",
    fullOverview: "The Ten Qira'at represent the authentic canonical methods of Quranic recitation transmitted through verified chains of narration (Mutawatir). This specialized course covers the major Riwayat (such as Hafs 'an Asim, Warsh 'an Nafi', Qalun, Shu'bah, and others) alongside the foundational poem Ash-Shatibiyyah.",
    targetAudience: [
      "Scholars, Huffaz, and advanced students who have completed an Ijazah in Hafs 'an Asim.",
      "Academic researchers in Quranic sciences and phonetics."
    ],
    learningObjectives: [
      "Understand the historical transmission and authenticity of the 10 Qira'at.",
      "Differentiate between Usul (foundational rules) and Farsh (specific word variants) of each Qari.",
      "Recite with authentic Riwayat like Warsh, Qalun, and Ad-Duri."
    ],
    curriculum: [
      {
        weekOrModule: "Level 1",
        title: "Introduction to Canonical Recitations",
        topics: ["History of Qira'at & seven Ahruf", "The 7 and 10 Reciters and their transmitters (Ruwat)", "Usul comparison"]
      },
      {
        weekOrModule: "Level 2",
        title: "In-depth Study of Selected Riwayat",
        topics: ["Riwayah of Warsh 'an Nafi'", "Riwayah of Shu'bah 'an Asim", "Practical comparative recitation"]
      }
    ],
    prerequisites: "Prior Ijazah in Hafs 'an Asim and thorough knowledge of classical Arabic and Tajweed.",
    suggestedLessonStructure: "60-minute scholarly instruction.",
    durationFrequency: "Subject to verified instructor availability and candidate evaluation.",
    verifiedNote: "Notice: Admission is subject to instructor availability and strict prerequisite verification.",
    faqs: [
      {
        question: "Can I choose which Riwayah to study first?",
        answer: "Yes, Warsh 'an Nafi' and Shu'bah 'an Asim are commonly selected initial pathways."
      }
    ]
  },
  {
    id: "tafseer-ul-quran",
    slug: "tafseer-ul-quran",
    title: "Tafseer-ul-Quran Course",
    titleUrdu: "تفسیر القرآن الکریم",
    category: "Islamic Knowledge",
    level: "Intermediate",
    featured: true,
    iconName: "Compass",
    shortDescription: "Deepen your understanding of Quranic verses, historical context (Asbab al-Nuzul), and practical life guidance.",
    fullOverview: "The Holy Quran is a book of guidance meant to be understood and reflected upon (Tadabbur). This course journeys through selected Surahs or the complete text, explaining linguistic nuances, causes of revelation, classical commentaries (Tafseer Ibn Katheer, Ma'arif-ul-Quran), and practical contemporary takeaways.",
    targetAudience: [
      "Anyone who recites the Quran and desires to understand what Allah is communicating.",
      "Parents and professionals wanting spiritual growth and deeper Quranic insight.",
      "Youth seeking answers to questions through authentic Quranic perspectives."
    ],
    learningObjectives: [
      "Understand the meaning of frequently recited Surahs and passages.",
      "Learn the historical contexts and Asbab al-Nuzul of key events.",
      "Extract actionable guidance and moral values for everyday living."
    ],
    curriculum: [
      {
        weekOrModule: "Part 1",
        title: "Foundations of Tafseer & Surah Al-Fatihah",
        topics: ["Principles of Tafseer (Usul al-Tafseer)", "Comprehensive commentary of Surah Al-Fatihah", "Key Quranic themes"]
      },
      {
        weekOrModule: "Part 2",
        title: "Tafseer of Juz Amma (Juz 30)",
        topics: ["Short Surahs explained verse-by-verse", "Eschatology and the Hereafter in early Makki Surahs", "Moral and theological lessons"]
      },
      {
        weekOrModule: "Part 3",
        title: "Major Surahs (Al-Baqarah, Yaseen, Al-Kahf)",
        topics: ["Prophetic stories and wisdom", "Islamic legal foundations and ethics", "Spiritual reflections (Tadabbur)"]
      }
    ],
    prerequisites: "Basic interest in Islamic understanding; available in English or Urdu.",
    suggestedLessonStructure: "40-minute interactive discussion with slides, translation breakdown, and Q&A.",
    durationFrequency: "Available in 2 or 3 sessions per week.",
    faqs: [
      {
        question: "Are classes conducted in English or Urdu?",
        answer: "Classes can be taught in fluent English or Urdu depending on the student's preference."
      }
    ]
  },
  {
    id: "arabic-language",
    slug: "arabic-language",
    title: "Arabic Language Course",
    titleUrdu: "اللغة العربية (عربی زبان)",
    category: "Islamic Knowledge",
    level: "All Levels",
    featured: false,
    iconName: "Languages",
    shortDescription: "Comprehensive Arabic language instruction covering Quranic vocabulary, grammar (Nahw & Sarf), and conversation.",
    fullOverview: "Unlock the beauty of the Quran in its original divine language. Our Arabic Language curriculum covers both Quranic Arabic (for textual comprehension) and Modern Standard Arabic (for communicative vocabulary and sentence construction).",
    targetAudience: [
      "Students wanting to understand Quranic verses without relying solely on translations.",
      "Beginners wanting to speak, read, and write Arabic with confidence.",
      "Students of Islamic knowledge preparing for classical texts."
    ],
    learningObjectives: [
      "Build a rich vocabulary of over 1,000 frequent Quranic words.",
      "Master essential grammar concepts (Ism, Fi'l, Harf, I'rab, sentence structure).",
      "Form sentences and comprehend Arabic dialogues and texts."
    ],
    curriculum: [
      {
        weekOrModule: "Level 1",
        title: "Foundational Grammar & Essential Vocabulary",
        topics: ["Noun types, gender, and numbers", "Demonstrative pronouns (Asma al-Isharah)", "Everyday conversational expressions"]
      },
      {
        weekOrModule: "Level 2",
        title: "Verb Conjugation (Sarf) & Sentence Syntax (Nahw)",
        topics: ["Past, present, and imperative verbs", "Prepositions & possessive constructions (Idafah)", "Quranic sentence parsing"]
      }
    ],
    prerequisites: "Ability to read Arabic script.",
    suggestedLessonStructure: "30-45 minute interactive language immersion.",
    durationFrequency: "Configurable by the academy.",
    faqs: [
      {
        question: "Does this focus on spoken Arabic or Quranic Arabic?",
        answer: "We offer both tracks. You can select Quranic Arabic or Spoken MSA during registration."
      }
    ]
  },
  {
    id: "islamic-studies",
    slug: "islamic-studies",
    title: "Islamic Studies Course",
    titleUrdu: "اسلامیات و دینی تعلیمات",
    category: "Islamic Knowledge",
    level: "All Levels",
    featured: true,
    iconName: "MoonStar",
    shortDescription: "Essential Islamic curriculum covering Aqeedah, Fiqh of worship, Seerah of the Prophet ﷺ, and Akhlaq.",
    fullOverview: "A holistic educational curriculum that nurtures a strong Muslim identity in children, youth, and adults. Covering Islamic beliefs (Aqeedah), practical rules of Salah, purification, Sawm, and Zakah (Fiqh), the inspiring life of Prophet Muhammad ﷺ (Seerah), and noble manners (Akhlaq & Adab).",
    targetAudience: [
      "Muslim children growing up in Western and international environments.",
      "Adults seeking structured reinforcement of foundational Islamic knowledge.",
      "Families seeking a comprehensive character-building Islamic curriculum."
    ],
    learningObjectives: [
      "Instill solid Islamic beliefs and understanding of the 6 pillars of Iman.",
      "Master step-by-step practical performance of Taharah, Wudu, and daily Salah.",
      "Learn key milestones from the life of the Prophet ﷺ and Sahabah.",
      "Cultivate Islamic manners, honesty, kindness to parents, and good character."
    ],
    curriculum: [
      {
        weekOrModule: "Module 1",
        title: "Aqeedah & The Five Pillars",
        topics: ["Tawheed, Angels, Revealed Books, Messengers, Day of Judgement, Qadar", "Shahadah, Salah, Zakah, Sawm, Hajj"]
      },
      {
        weekOrModule: "Module 2",
        title: "Practical Fiqh of Worship",
        topics: ["Step-by-step Wudu and Salah demonstration", "Conditions, obligations, and Sunnahs of prayer", "Practical dos and don'ts"]
      },
      {
        weekOrModule: "Module 3",
        title: "Seerah & Islamic Character (Adab)",
        topics: ["Life of the Prophet Muhammad ﷺ in Makkah & Madinah", "Respecting parents, teachers, and neighbors", "Islamic etiquette in daily life"]
      }
    ],
    prerequisites: "None. Open to all students.",
    suggestedLessonStructure: "30-minute engaging, story-based and concept-driven classes.",
    durationFrequency: "Configurable by the academy.",
    faqs: [
      {
        question: "Is this course appropriate for young children in the UK/USA/Canada?",
        answer: "Yes, lessons are specifically customized for children living in international environments with relatable examples."
      }
    ]
  },
  {
    id: "daily-duas",
    slug: "daily-duas",
    title: "Daily Duas & Supplications",
    titleUrdu: "مسنون دعائیں و اذکار",
    category: "Islamic Knowledge",
    level: "All Levels",
    featured: false,
    iconName: "HeartHandshake",
    shortDescription: "Learn, memorize, and understand authentic Sunnah supplications for every aspect of daily life.",
    fullOverview: "Connect every moment of your daily routine to Allah with authentic Masnoon Duas from the Sunnah. Students learn correct Arabic pronunciation, word-by-word English or Urdu meanings, and the occasions for each supplication.",
    targetAudience: [
      "Children developing daily Sunnah habits.",
      "Adults wishing to memorize authentic morning and evening Adhkar.",
      "Anyone desiring spiritual mindfulness in everyday routines."
    ],
    learningObjectives: [
      "Memorize essential daily supplications (waking up, sleeping, eating, entering home/masjid, traveling).",
      "Understand the deep spiritual meaning of each Dua.",
      "Implement authentic morning and evening protection Adhkar."
    ],
    curriculum: [
      {
        weekOrModule: "Part 1",
        title: "Routine Daily Duas",
        topics: ["Eating and drinking etiquette", "Sleeping and waking up", "Entering and leaving home/mosque", "Dressing and grooming"]
      },
      {
        weekOrModule: "Part 2",
        title: "Prayer-Related Supplications & Protection Adhkar",
        topics: ["Duas in Salah (Ruku, Sujood, Tashahhud)", "Morning and evening protective Adhkar (Ayat al-Kursi, Al-Mu'awwidhat)", "Duas in distress and difficulty"]
      }
    ],
    prerequisites: "None.",
    suggestedLessonStructure: "20-30 minute focused memorization and explanation session.",
    durationFrequency: "Configurable by the academy.",
    faqs: [
      {
        question: "Can this course be combined with Quran reading or Tajweed classes?",
        answer: "Yes, many parents combine 20 minutes of Quran reading with 10 minutes of daily Duas and Islamic manners."
      }
    ]
  }
];
