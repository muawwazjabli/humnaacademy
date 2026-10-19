# Humna Academy - Official Website & Learning Platform

A modern, responsive, and production-ready web application for **Humna Academy**, an online Quran and Islamic education academy serving international students across Pakistan, the UK, the USA, Canada, Australia, and worldwide.

---

## 1. Academy Overview

- **Academy Name:** Humna Academy
- **Business Type:** Online Quran Academy and Islamic Education
- **Official Contact & WhatsApp:** `+92 301 7291844`
- **WhatsApp Link:** [https://wa.me/923017291844](https://wa.me/923017291844)
- **Official Social Media Channels:**
  - Facebook: [https://www.facebook.com/humnaacademy/](https://www.facebook.com/humnaacademy/)
  - YouTube: [https://www.youtube.com/@HAMNAACADEMY](https://www.youtube.com/@HAMNAACADEMY)
  - TikTok: [https://www.tiktok.com/@hamnaacademy](https://www.tiktok.com/@hamnaacademy)
  - Instagram: [https://www.instagram.com/acdemyhumna/](https://www.instagram.com/acdemyhumna/)

> **Integrity & Transparency:** This application adheres strictly to honest representation. No fake reviews, artificial star ratings, or invented teacher credentials are used. Unverified data is explicitly marked as structured placeholders awaiting verified roster details from the academy.

---

## 2. Technology Stack & Features

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom Islamic palette:
  - Deep Islamic Green: `#123F32`
  - Emerald Green: `#16845B`
  - Warm Cream: `#F6F0E4`
  - Gold Accents: `#C5A15A`
- **Icons:** Lucide Icons
- **Bilingual & RTL:** Interactive language switcher supporting English (LTR) and Urdu (RTL) with appropriate font fallbacks.
- **WhatsApp Integration:** Floating responsive widget with contextual prefilled templates (Trial, Courses, Pricing, General).
- **Trial Booking Workflow:** Complete 14-field accessible form with instant client validation, server-side validation, duplicate submission protection, and instant WhatsApp forwarding.
- **Course Catalog:** 13 detailed courses with individual SEO-optimized pages, curriculum outlines, and FAQs.
- **Portals Foundation:** Scalable architectural foundations for Student and Admin dashboards.

---

## 3. Implemented Course Catalog (13 Courses)

1. **Quran Reading Course (Nazra):** Fluent reading with correct pronunciation.
2. **Noorani Qaida:** Foundational phonetics, Arabic letters, and vowels.
3. **Rahmani Qaida:** Structured primer with simplified orthography.
4. **Madani Qaida:** Comprehensive primer with Tajweed rule explanations.
5. **Baghdadi Qaida:** Traditional classical spelling and rhythmic reading.
6. **Tajweed-ul-Quran:** Articulation points (*Makharij*), characteristics (*Sifaat*), and recitation rules.
7. **Hifz-ul-Quran:** Memorization program with *Sabaq*, *Sabqi*, and *Manzil* tracking.
8. **Ijazah Preparation Course:** Advanced recitation with verified Sanad requirements and strict prerequisites.
9. **Ten Qira'at Course:** Advanced canonical transmissions (*Riwayat*) with scholarly prerequisites.
10. **Tafseer-ul-Quran:** Contextual meanings, *Asbab al-Nuzul*, and practical reflections.
11. **Arabic Language:** Quranic grammar (*Nahw* & *Sarf*), vocabulary, and conversational foundations.
12. **Islamic Studies:** Aqeedah, Salah, Seerah, and Akhlaq for youth and adults.
13. **Daily Duas:** Masnoon supplications with meanings and memorization.

---

## 4. Getting Started & Local Installation

### Prerequisites
- Node.js LTS (v18.17+ or v20+)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the repository
cd "j:\My Drive\hamna academy\website"

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 5. Environment Variables & Database Setup

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Standalone / Demo Mode (Default)
If no database credentials are provided, the application automatically runs in **Demo Mode**:
- Trial requests are validated on the server.
- The user is issued a unique Reference ID (e.g., `HA-104921`).
- The user is presented with a 1-click option to forward the booking directly to the official academy WhatsApp (`+92 301 7291844`).

### Connecting Supabase (Production Mode)
To store trial bookings in a persistent PostgreSQL database:

1. Create a project on [Supabase](https://supabase.com).
2. Set the following in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Run the following SQL migration in your Supabase SQL Editor:
```sql
create table if not exists trial_requests (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null,
  full_name text not null,
  age_group text not null,
  parent_name text,
  email text,
  whatsapp_number text not null,
  country text,
  preferred_course text not null,
  reading_level text,
  preferred_teacher text,
  preferred_language text,
  preferred_days text[],
  preferred_time text,
  time_zone text not null,
  additional_message text,
  status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table trial_requests enable row level security;

-- Policy allowing public form submissions
create policy "Allow anonymous trial submissions"
on trial_requests for insert
to anon
with check (true);

-- Policy allowing admin service role full access
create policy "Allow service role full access"
on trial_requests for all
to service_role
using (true);
```

---

## 6. Production Deployment

The project is ready for deployment on **Vercel**, **Netlify**, or any Node.js hosting platform:

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 7. Status of Features & Verification

| Feature | Status | Notes |
|---|---|---|
| Responsive Navigation & Mobile Drawer | ✅ Complete | Fully tested with active links and LTR/RTL support |
| Bilingual Support (English / Urdu) | ✅ Complete | Interactive toggle with `dir="rtl"` and Urdu typography |
| 13 Individual Course Pages | ✅ Complete | Detailed curriculum, objectives, level, and FAQs |
| Free Trial Booking Form | ✅ Complete | 14 validated fields, duplicate protection, reference ID |
| WhatsApp Integration (+92 301 7291844) | ✅ Complete | Floating widget + contextual prefilled messages |
| Teacher Roster Page | ✅ Complete | Structured with honest transparent placeholders |
| Configurable Pricing Page | ✅ Complete | Multi-currency (PKR, GBP, USD, CAD, AUD) & policies |
| Blog & Educational Resources | ✅ Complete | 6 articles with draft review notices & tags |
| Categorized FAQ Page | ✅ Complete | Confirmed policies distinguished from pending items |
| Student & Admin Portal Foundations | ✅ Complete | Interactive mock dashboards & SQL schema |
| SEO, Sitemap & Robots.txt | ✅ Complete | Dynamic `sitemap.xml` and `robots.txt` generated |
| Live Payment Gateway | ⚠️ Requires Merchant Credentials | Documented in Pricing & Admin sections |
| Live Database Persistence | ⚠️ Requires Supabase URL/Key | Seamless fallback to Demo + WhatsApp forwarding |
