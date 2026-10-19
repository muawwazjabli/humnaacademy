import { PricingPlan } from "@/types";

export const PRICING_CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($) - United States & International" },
  { code: "GBP", symbol: "£", label: "GBP (£) - United Kingdom" },
  { code: "CAD", symbol: "CA$", label: "CAD ($) - Canada" },
  { code: "AUD", symbol: "AU$", label: "AUD ($) - Australia" },
  { code: "PKR", symbol: "Rs.", label: "PKR (Rs.) - Pakistan" },
] as const;

export type SupportedCurrency = "USD" | "GBP" | "CAD" | "AUD" | "PKR";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "plan-2-days",
    name: "Weekend & Starter Plan",
    classesPerWeek: 2,
    durationMinutes: 30,
    monthlyFees: {
      USD: "35",
      GBP: "28",
      CAD: "45",
      AUD: "50",
      PKR: "4,500"
    },
    features: [
      "2 one-to-one classes per week (8-9 monthly)",
      "30 minutes per class session",
      "Flexible weekend or weekday slots",
      "Male or female teacher preference",
      "Monthly student progress review",
      "Free 30-minute introductory trial session"
    ],
    customPricingNote: "Indicative base rate. Final fee is confirmed upon schedule selection."
  },
  {
    id: "plan-3-days",
    name: "Standard Learning Plan",
    classesPerWeek: 3,
    durationMinutes: 30,
    monthlyFees: {
      USD: "50",
      GBP: "40",
      CAD: "65",
      AUD: "75",
      PKR: "6,500"
    },
    features: [
      "3 one-to-one classes per week (12-13 monthly)",
      "30 minutes per class session",
      "Optimal balance of learning and home practice",
      "Continuous Tajweed & recitation correction",
      "Complementary Daily Duas & Islamic etiquette",
      "Makeup class assistance for planned absences"
    ],
    isPopular: true,
    customPricingNote: "Most popular choice for steady retention and confidence building."
  },
  {
    id: "plan-5-days",
    name: "Intensive / Hifz Plan",
    classesPerWeek: 5,
    durationMinutes: 30,
    monthlyFees: {
      USD: "75",
      GBP: "60",
      CAD: "99",
      AUD: "115",
      PKR: "9,500"
    },
    features: [
      "5 one-to-one classes per week (20-22 monthly)",
      "30 minutes per session (extended 45m available)",
      "Essential for Quran Memorization (Hifz) & fast-track reading",
      "Daily Sabaq, Sabqi, and Manzil tracking",
      "Priority scheduling in peak international evening slots",
      "Detailed bi-weekly progress reporting"
    ],
    customPricingNote: "Strongly recommended for active Hifz students or intensive Qaida completion."
  }
];

export const PRICING_POLICIES = {
  familyDiscount: "Family & sibling discounts (e.g. 10% for 2nd and 3rd student) may be offered upon academy confirmation.",
  paymentMethods: [
    "Bank Transfer (Pakistan / UK / US / International)",
    "Remitly, Wise, Western Union, RIA",
    "Direct online invoice (when integrated with merchant gateway)"
  ],
  refundPolicy: "Humna Academy aims for total satisfaction. If you are not satisfied within the first week after your trial, remaining unconsumed classes can be credited or refunded upon review.",
  reschedulingPolicy: "Please notify your instructor at least 6 hours in advance for rescheduled or makeup classes."
};
