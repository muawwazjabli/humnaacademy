import { WebsiteContentData, WebsiteSettingsData } from "@/types";
import { ACADEMY_CONFIG } from "./constants";

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentData = {
  hero: {
    badgeEn: "Online Quran & Islamic Academy for Global Students",
    badgeUr: "دنیا بھر کے طلباء کے لیے آن لائن قرآن اکیڈمی",
    headingEn: "Learn Quran Online with",
    headingUr: "آن لائن قرآن مجید سیکھیں",
    subtitleEn:
      "Learn Quran recitation, Tajweed, Hifz, and Islamic Studies with personalized online lessons designed for children and adults worldwide.",
    subtitleUr:
      "بچوں اور بڑوں کے لیے ناظرہ قرآن، تجوید، حفظ اور اسلامی تعلیمات کے انفرادی اور معیاری آن لائن اسباق۔",
    ctaTextEn: "Book Your Free Trial",
    ctaTextUr: "مفت ٹرائل کلاس حاصل کریں",
    ctaLink: "/book-trial",
    secondaryCtaEn: "Explore Our Courses",
    secondaryCtaUr: "ہمارے تمام کورسز دیکھیں",
    slides: [
      {
        imageUrl: "/1.jpg",
        altEn: "Humna Academy Online Quran Classes - Slide 1",
        altUr: "حُمنہ اکیڈمی آن لائن قرآن کلاسز - سلائیڈ 1",
      },
      {
        imageUrl: "/2.jpg",
        altEn: "Humna Academy Qualified Quran Teachers - Slide 2",
        altUr: "حُمنہ اکیڈمی مستند اساتذہ کرام - سلائیڈ 2",
      },
      {
        imageUrl: "/3.jpg",
        altEn: "Humna Academy Tajweed and Hifz Lessons - Slide 3",
        altUr: "حُمنہ اکیڈمی تجوید اور حفظ قرآن - سلائیڈ 3",
      },
      {
        imageUrl: "/4.jpg",
        altEn: "Humna Academy Flexible International Timings - Slide 4",
        altUr: "حُمنہ اکیڈمی لچکدار اوقات کار - سلائیڈ 4",
      },
    ],
  },
  announcement: {
    enabled: true,
    textEn:
      "Free 30-Minute Trial Session Available • Flexible 1-on-1 Classes for Children & Adults",
    textUr:
      "مفت 30 منٹ ٹرائل کلاس دستیاب ہے • بچوں اور بڑوں کے لیے ون ٹو ون کلاسز",
    ctaTextEn: "Book Free Trial",
    ctaTextUr: "مفت ٹرائل بک کریں",
    ctaLink: "/book-trial",
  },
  about: {
    headingEn: "Dedicated to Authentic Quranic Education Worldwide",
    headingUr: "دنیا بھر میں مستند قرآنی تعلیم کی فراہمی",
    introEn:
      "Humna Academy is an online Quran and Islamic education platform dedicated to helping children and adults develop fluent Quran reading, authentic Tajweed, memorization (Hifz), and foundational Islamic understanding from home.",
    introUr:
      "حُمنہ اکیڈمی ایک آن لائن قرآن و اسلامی تعلیمی ادارہ ہے جو بچوں اور بڑوں کو گھر بیٹھے ناظرہ، تجوید، حفظ اور بنیادی دینی علوم سکھانے کے لیے وقف ہے۔",
    missionEn:
      "To connect Muslim families globally with attentive, qualified Quran educators in structured one-to-one online sessions.",
    missionUr:
      "دنیا بھر کے مسلمان خاندانوں کو منظم ون ٹو ون آن لائن کلاسز کے ذریعے مستند اساتذہ سے جوڑنا۔",
    visionEn:
      "Nurturing lifelong love, accuracy, and consistency with the Book of Allah across every age group and time zone.",
    visionUr:
      "ہر عمر کے طلباء کے دلوں میں قرآن مجید سے محبت، درست ادائیگی اور مستقل مزاجی پیدا کرنا۔",
  },
  whyChooseUs: [
    {
      id: "why-1",
      titleEn: "One-to-One Quran Classes",
      titleUr: "ون ٹو ون انفرادی کلاسز",
      descEn: "Dedicated live sessions with full teacher focus tailored to each student's pace.",
      descUr: "ہر طالب علم کی ذہنی سطح اور رفتار کے مطابق استاد کی مکمل انفرادی توجہ۔",
      icon: "Users",
      displayOrder: 1,
    },
    {
      id: "why-2",
      titleEn: "Flexible Global Scheduling",
      titleUr: "لچکدار اوقات کار",
      descEn: "Classes aligned to PK, UK, US, Canada, Australia, and Gulf time zones.",
      descUr: "پاکستان، برطانیہ، امریکہ، کینیڈا اور آسٹریلیا کے اوقات کے مطابق کلاسز۔",
      icon: "Clock",
      displayOrder: 2,
    },
    {
      id: "why-3",
      titleEn: "Male & Female Instructors",
      titleUr: "مرد و خواتین اساتذہ",
      descEn: "Qualified male and female tutors available upon preference and slot availability.",
      descUr: "خواتین اور بچوں کے لیے معلمات اور طلباء کے لیے تجربہ کار قراء حضرات۔",
      icon: "Shield",
      displayOrder: 3,
    },
    {
      id: "why-4",
      titleEn: "Children & Adults Tracks",
      titleUr: "بچوں اور بڑوں کے کورسز",
      descEn: "Engaging child-friendly methods alongside structured adult-paced modules.",
      descUr: "بچوں کے لیے شفیق اور بڑوں کے لیے باوقار اور آسان تدریسی طریقہ کار۔",
      icon: "BookOpen",
      displayOrder: 4,
    },
  ],
  howItWorks: [
    {
      step: 1,
      titleEn: "Submit Free Trial Request",
      titleUr: "مفت ٹرائل فارم پُر کریں",
      descEn: "Fill out our quick online booking form with your preferred course and time zone.",
      descUr: "اپنا پسندیدہ کورس، وقت اور رابطہ نمبر فارم میں درج کر کے درخواست بھیجیں۔",
    },
    {
      step: 2,
      titleEn: "Confirm Schedule with Academy",
      titleUr: "اکیڈمی سے شیڈول طے کریں",
      descEn: "Our academic coordinator connects on WhatsApp to match a tutor and confirm your slot.",
      descUr: "ہمارا کوآرڈینیٹر واٹس ایپ پر آپ سے رابطہ کر کے استاد اور وقت کی تصدیق کرے گا۔",
    },
    {
      step: 3,
      titleEn: "Join Live Class & Begin",
      titleUr: "آن لائن کلاس شروع کریں",
      descEn: "Meet your tutor online via Zoom, Skype, or Google Meet and start learning smoothly.",
      descUr: "زوم یا اسکائپ کے ذریعے لائیو کلاس جوائن کریں اور سیکھنے کا آغاز کریں۔",
    },
  ],
  statistics: [
    { labelEn: "Structured Courses", labelUr: "مستند کورسز", value: "13" },
    { labelEn: "Learning Format", labelUr: "طریقہ تعلیم", value: "1-on-1" },
    { labelEn: "Free Trial Session", labelUr: "مفت ٹرائل کلاس", value: "30 Min" },
  ],
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsData = {
  academyName: ACADEMY_CONFIG.name,
  tagline: ACADEMY_CONFIG.tagline,
  logoUrl: "/logo.jpg",
  faviconUrl: "/logo.jpg",
  siteTitle: "Humna Academy | Online Quran Academy & Islamic Education",
  metaDescription:
    "Learn Quran online with personalized one-to-one lessons in Nazra, Noorani Qaida, Tajweed, Hifz, Tafseer, and Arabic for children and adults worldwide. Book your free trial today.",
  defaultLanguage: "en",
  defaultCurrency: "USD",
  whatsappNumber: ACADEMY_CONFIG.whatsappRaw,
  phoneDisplay: ACADEMY_CONFIG.phone,
  contactEmail: "",
  contactAddress: "Online Academy • Serving Students Worldwide",
  businessHours: "24/7 Flexible International Class Slots",
  social: {
    facebook: ACADEMY_CONFIG.social.facebook,
    youtube: ACADEMY_CONFIG.social.youtube,
    tiktok: ACADEMY_CONFIG.social.tiktok,
    instagram: ACADEMY_CONFIG.social.instagram,
  },
  maintenanceMode: false,
  footerDescriptionEn:
    "Humna Academy is an online Quran and Islamic education academy offering one-to-one personalized learning in Quran Reading (Nazra), Tajweed, Hifz, Tafseer, and Arabic for children and adults worldwide.",
  footerDescriptionUr:
    "حُمنہ اکیڈمی ایک آن لائن قرآن و اسلامی تعلیمی اکیڈمی ہے جو دنیا بھر میں بچوں اور بڑوں کے لیے ناظرہ قرآن، تجوید، حفظ، تفسیر اور عربی زبان کی ون ٹو ون کلاسز فراہم کرتی ہے۔",
  copyrightText: "Humna Academy. All rights reserved.",
};
