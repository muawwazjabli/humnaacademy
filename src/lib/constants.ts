export const ACADEMY_CONFIG = {
  name: "Humna Academy",
  tagline: "Online Quran Academy and Islamic Education",
  phone: "+92 301 7291844",
  whatsappRaw: "923017291844",
  social: {
    facebook: "https://www.facebook.com/humnaacademy/",
    youtube: "https://www.youtube.com/@HAMNAACADEMY",
    tiktok: "https://www.tiktok.com/@hamnaacademy",
    instagram: "https://www.instagram.com/acdemyhumna/",
  },
  demoModeNotice: "Demo / Standalone Mode: Booking requests are securely prepared and can be forwarded directly to the academy via official WhatsApp or processed via Supabase when configured.",
};

export const COMMON_TIMEZONES = [
  { value: "Asia/Karachi", label: "Pakistan Standard Time (PKT - UTC+5)" },
  { value: "Europe/London", label: "United Kingdom (GMT/BST - UTC+0/+1)" },
  { value: "America/New_York", label: "US & Canada Eastern (EST/EDT - UTC-5/-4)" },
  { value: "America/Chicago", label: "US & Canada Central (CST/CDT - UTC-6/-5)" },
  { value: "America/Denver", label: "US & Canada Mountain (MST/MDT - UTC-7/-6)" },
  { value: "America/Los_Angeles", label: "US & Canada Pacific (PST/PDT - UTC-8/-7)" },
  { value: "Australia/Sydney", label: "Australia Eastern (AEST/AEDT - UTC+10/+11)" },
  { value: "Asia/Dubai", label: "United Arab Emirates (GST - UTC+4)" },
  { value: "Europe/Berlin", label: "Central European Time (CET - UTC+1/+2)" },
];

export const TEACHING_LANGUAGES = [
  "English",
  "Urdu",
  "Punjabi",
  "Arabic (Instructional)",
];

export function buildWhatsAppLink(
  type: 'general' | 'course' | 'trial' | 'pricing',
  details?: { courseName?: string; planName?: string; customMessage?: string }
): string {
  let text = "";
  switch (type) {
    case 'course':
      text = `Assalamu Alaikum Humna Academy, I would like to inquire about the ${details?.courseName || 'Quran'} course. Could you please share more information regarding schedule and enrollment?`;
      break;
    case 'trial':
      text = details?.customMessage || `Assalamu Alaikum Humna Academy, I would like to book a free trial class for online Quran lessons. Please let me know the available time slots.`;
      break;
    case 'pricing':
      text = `Assalamu Alaikum Humna Academy, I would like to inquire about the fee structure and monthly plans for ${details?.planName || 'online Quran classes'}.`;
      break;
    case 'general':
    default:
      text = `Assalamu Alaikum Humna Academy, I am interested in your online Quran and Islamic studies classes and would like to get more information.`;
      break;
  }
  return `https://wa.me/${ACADEMY_CONFIG.whatsappRaw}?text=${encodeURIComponent(text)}`;
}
