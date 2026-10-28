import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { LanguageProvider } from "@/components/LanguageContext";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://humnaacademy.com"),
  title: {
    default: "Humna Academy | Online Quran Academy & Islamic Education",
    template: "%s | Humna Academy",
  },
  description:
    "Learn Quran online with personalized one-to-one lessons in Nazra, Noorani Qaida, Tajweed, Hifz, Tafseer, and Arabic for children and adults worldwide. Book your free trial today.",
  keywords: [
    "Online Quran Academy",
    "Learn Quran Online",
    "Online Quran Classes for Kids",
    "Quran with Tajweed",
    "Online Hifz Classes",
    "Quran Classes for Adults",
    "Noorani Qaida Online",
    "Female Quran Teacher Online",
    "Islamic Studies Online",
    "Humna Academy",
  ],
  authors: [{ name: "Humna Academy" }],
  openGraph: {
    title: "Humna Academy | Online Quran Academy & Islamic Education",
    description:
      "One-to-one online Quran classes for kids and adults worldwide. Certified teachers, flexible timings, and free trial class.",
    url: "https://humnaacademy.com",
    siteName: "Humna Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humna Academy | Online Quran Academy",
    description:
      "Learn Quran online with personalized lessons in Nazra, Tajweed, and Hifz. Free trial available.",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('humna_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsAppFloatingButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
