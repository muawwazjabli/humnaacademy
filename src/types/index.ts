export type Language = 'en' | 'ur';

export type PublishStatus = 'published' | 'draft';

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleUrdu: string;
  titleArabic?: string;
  category: 'Foundation' | 'Recitation & Rules' | 'Recitation & Tajweed' | 'Memorization' | 'Advanced Studies' | 'Islamic Knowledge';
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
  classDuration?: string;
  teacherType?: string;
  features?: string[];
  imageUrl?: string;
  featured: boolean;
  iconName: string;
  faqs: { question: string; answer: string }[];
  verifiedNote?: string;
  status?: PublishStatus;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  englishName?: string;
  urduName?: string;
  gender: 'Male' | 'Female';
  title: string;
  photoUrl?: string;
  bio: string;
  qualifications: string[];
  experienceYears: string;
  specialization: string[];
  languages: string[];
  availability: string;
  assignedCourses?: string[];
  isPlaceholder: boolean;
  status?: PublishStatus;
  active?: boolean;
  displayOrder?: number;
  portalUsername?: string;     // Teacher Login Username
  portalPassword?: string;     // Teacher Login Password
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  shortDescription?: string;
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
  status?: PublishStatus;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  urduTitle?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  draftNotice: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrialBookingPayload {
  fullName: string;
  ageGroup: 'child' | 'adult';
  studentAge?: string;
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

export type TrialStatus =
  | 'New'
  | 'Contacted'
  | 'Scheduled'
  | 'Trial Completed'
  | 'Enrolled'
  | 'Not Interested'
  | 'Cancelled';

export interface TrialRequestRecord extends Omit<TrialBookingPayload, 'consentAgreed'> {
  id: string;
  referenceId: string;
  status: TrialStatus;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  internalNotes?: string;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  category: 'Trial & Registration' | 'Courses & Learning' | 'Teachers & Scheduling' | 'Fees & Policies' | 'Technical & Contact';
  question: string;
  questionUrdu?: string;
  answer: string;
  answerUrdu?: string;
  isPolicyConfirmed: boolean;
  status?: PublishStatus;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type StudentStatus = 'Active' | 'Inactive' | 'Pending' | 'Completed';

export interface StudentRecord {
  id: string;
  fullName: string;
  parentName?: string;
  email?: string;
  whatsappNumber: string;
  country: string;
  timeZone: string;
  age?: string;
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  selectedCourse: string;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  classTime?: string;          // e.g. "05:00 PM"
  classDays?: string;          // e.g. "Monday, Wednesday, Friday"
  classDuration?: string;      // e.g. "30 mins"
  meetingLink?: string;        // Zoom / Google Meet link
  portalUsername?: string;     // Student Login Username
  portalPassword?: string;     // Student Login Password
  enrollmentDate: string;
  status: StudentStatus;
  adminNotes?: string;
  trialReferenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  country: string;
  text: string;
  profileImage?: string;
  courseName: string;
  rating?: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  displayOrder: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContactMessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactMessageRecord {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  type: 'trial' | 'message' | 'student' | 'testimonial' | 'system';
  title: string;
  message: string;
  link: string;
  read: boolean;
  recordId?: string;
  createdAt: string;
}

export interface ActivityLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  module: string;
  recordId?: string;
  summary: string;
  timestamp: string;
}

export interface WebsiteContentData {
  hero: {
    badgeEn: string;
    badgeUr: string;
    headingEn: string;
    headingUr: string;
    subtitleEn: string;
    subtitleUr: string;
    ctaTextEn: string;
    ctaTextUr: string;
    ctaLink: string;
    secondaryCtaEn: string;
    secondaryCtaUr: string;
    slides: { imageUrl: string; altEn: string; altUr: string }[];
  };
  announcement: {
    enabled: boolean;
    textEn: string;
    textUr: string;
    ctaTextEn: string;
    ctaTextUr: string;
    ctaLink: string;
  };
  about: {
    headingEn: string;
    headingUr: string;
    introEn: string;
    introUr: string;
    missionEn: string;
    missionUr: string;
    visionEn: string;
    visionUr: string;
  };
  whyChooseUs: {
    id: string;
    titleEn: string;
    titleUr: string;
    descEn: string;
    descUr: string;
    icon: string;
    displayOrder: number;
  }[];
  howItWorks: {
    step: number;
    titleEn: string;
    titleUr: string;
    descEn: string;
    descUr: string;
  }[];
  statistics: {
    labelEn: string;
    labelUr: string;
    value: string;
  }[];
  updatedAt?: string;
}

export interface WebsiteSettingsData {
  academyName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  siteTitle: string;
  metaDescription: string;
  defaultLanguage: Language;
  defaultCurrency: 'USD' | 'GBP' | 'CAD' | 'AUD' | 'PKR';
  whatsappNumber: string;
  phoneDisplay: string;
  contactEmail: string;
  contactAddress: string;
  businessHours: string;
  social: {
    facebook: string;
    youtube: string;
    tiktok: string;
    instagram: string;
  };
  maintenanceMode: boolean;
  footerDescriptionEn: string;
  footerDescriptionUr: string;
  copyrightText: string;
  updatedAt?: string;
}
