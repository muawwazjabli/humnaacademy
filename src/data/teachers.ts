import { TeacherProfile } from "@/types";

export const TEACHER_PROFILES: TeacherProfile[] = [
  {
    id: "teacher-male-placeholder-1",
    name: "Teacher Profile [Awaiting Academy Roster]",
    gender: "Male",
    title: "Senior Quran & Tajweed Instructor (Male)",
    bio: "Placeholder profile: Humna Academy selects certified male Quran teachers with Ijazah and extensive experience in one-to-one online instruction for children and adults.",
    qualifications: [
      "Shahadat-ul-Alimiyyah / Islamic Studies Degree (Pending Verification)",
      "Hafiz-ul-Quran with Certified Sanad (Pending Verification)",
      "Certified Tajweed Pedagogy Training"
    ],
    experienceYears: "5+ Years Teaching Online",
    specialization: ["Nazra Quran", "Tajweed Rules", "Hifz Supervision", "Tafseer Basics"],
    languages: ["English", "Urdu", "Arabic"],
    availability: "Flexible time zones (UK, US, Canada, Pakistan, Gulf)",
    isPlaceholder: true
  },
  {
    id: "teacher-female-placeholder-2",
    name: "Teacher Profile [Awaiting Academy Roster]",
    gender: "Female",
    title: "Senior Quran & Tajweed Instructress (Female)",
    bio: "Placeholder profile: Humna Academy provides dedicated female Quran teachers for sisters, girls, and young children in a comfortable, respectful, and encouraging environment.",
    qualifications: [
      "Alimah Course Graduate (Pending Verification)",
      "Hafiza-ul-Quran (Pending Verification)",
      "Specialist in Early Childhood Quranic Foundation"
    ],
    experienceYears: "4+ Years Teaching Online",
    specialization: ["Noorani Qaida", "Nazra for Children", "Tajweed for Sisters", "Islamic Studies"],
    languages: ["English", "Urdu"],
    availability: "Morning and evening international time slots",
    isPlaceholder: true
  },
  {
    id: "teacher-hifz-placeholder-3",
    name: "Hifz Specialist [Awaiting Academy Roster]",
    gender: "Male",
    title: "Lead Quran Memorization (Hifz) Mentor",
    bio: "Placeholder profile: Experienced Qari focused on structured daily revision, retention strategies, and error-free recitation for memorization students.",
    qualifications: [
      "Hafiz with Continuous Sanad (Pending Verification)",
      "Qira'at Specialization (Pending Verification)"
    ],
    experienceYears: "7+ Years Memorization Mentorship",
    specialization: ["Hifz-ul-Quran", "Daur & Manzil Revision", "Advanced Tajweed"],
    languages: ["English", "Urdu", "Arabic"],
    availability: "Early morning & weekend tracks",
    isPlaceholder: true
  }
];
