export type Language = 'en' | 'ur';

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleUrdu: string;
  category: 'Foundation' | 'Recitation & Rules' | 'Memorization' | 'Advanced Studies' | 'Islamic Knowledge';
  shortDescription: string;
  fullOverview: string;
  targetAudience: string[];
  learningObjectives: string[];
  curriculum: {
    weekOrModule: string;
    title: string;
    topics: string[];
  }[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  prerequisites: string;
  suggestedLessonStructure: string;
  durationFrequency: string;
  featured: boolean;
  iconName: string;
  faqs: { question: string; answer: string }[];
  verifiedNote?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  title: string;
  bio: string;
  qualifications: string[];
  experienceYears: string;
  specialization: string[];
  languages: string[];
  availability: string;
  isPlaceholder: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  classesPerWeek: number;
  durationMinutes: number;
  monthlyFees: {
    PKR: string;
    USD: string;
    GBP: string;
    CAD: string;
    AUD: string;
  };
  features: string[];
  isPopular?: boolean;
  customPricingNote: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  draftNotice: string;
  tags: string[];
}

export interface TrialBookingPayload {
  fullName: string;
  ageGroup: 'child' | 'adult';
  parentName?: string;
  email?: string;
  whatsappNumber: string;
  country: string;
  preferredCourse: string;
  readingLevel: 'Complete Beginner' | 'Can read letters' | 'Slow reading' | 'Fluent' | 'Advanced';
  preferredTeacher: 'male' | 'female' | 'no_preference';
  preferredLanguage: string;
  preferredDays: string[];
  preferredTime: string;
  timeZone: string;
  additionalMessage?: string;
  consentAgreed: boolean;
}

export interface FAQItem {
  id: string;
  category: 'Trial & Registration' | 'Courses & Learning' | 'Teachers & Scheduling' | 'Fees & Policies' | 'Technical & Contact';
  question: string;
  answer: string;
  isPolicyConfirmed: boolean;
}
