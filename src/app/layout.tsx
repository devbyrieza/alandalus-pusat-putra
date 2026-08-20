import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// IMPORT NAVBAR & FOOTER
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT CONFIGURATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import { BRANDING } from "@/config/branding";
import SplashScreen from "@/components/ui/SplashScreen";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Playfair Display — font serif prestisius untuk hero headline
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["700", "800", "900"],
});

// METADATA CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const metadata: Metadata = {
  metadataBase: new URL(BRANDING.websiteUrl),

  title: {
    default: `${BRANDING.schoolName} | PPDB 2027/2028`,
    template: `%s | ${BRANDING.schoolName}`,
  },
  description: `Pendaftaran Santri Baru ${BRANDING.schoolName}. Pendidikan berbasis Al-Qur'an dan As-Sunnah sesuai pemahaman salafush shalih.`,
  keywords: [
    BRANDING.schoolName,
    "pesantren jonggol",
    "ppdb 2026",
    "pendaftaran santri",
    "pesantren salafi",
    "tahfidz quran",
    "pendidikan islam",
  ],

  authors: [{ name: BRANDING.schoolName }],
  creator: BRANDING.schoolName,
  publisher: BRANDING.schoolName,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: BRANDING.faviconPath,
    apple: "/apple-touch-icon.png",
    shortcut: BRANDING.faviconPath,
  },

  openGraph: {
    title: `${BRANDING.schoolName} | PPDB 2027/2028`,
    description:
      "Pendidikan berbasis Al-Qur'an dan As-Sunnah sesuai pemahaman salafush shalih. Daftar sekarang untuk tahun ajaran 2027/2028.",
    url: BRANDING.websiteUrl,
    siteName: BRANDING.schoolName,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: BRANDING.schoolName,
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${BRANDING.schoolName} | PPDB 2027/2028`,
    description:
      "Pendidikan berbasis Al-Qur'an dan As-Sunnah sesuai pemahaman salafush shalih.",
    images: ["/twitter-image.jpg"],
    creator: "@alandalus_ppdb",
  },

  verification: {
    google: "your-google-verification-code",
  },

  alternates: {
    canonical: BRANDING.websiteUrl,
    languages: {
      "id-ID": BRANDING.websiteUrl,
    },
  },

  category: "education",
  classification: "Islamic Education",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROOT LAYOUT COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" translate="no" className="notranslate" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={BRANDING.primaryColor} />
        <meta
          name="msapplication-navbutton-color"
          content={BRANDING.primaryColor}
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="color-scheme" content="light only" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --brand-primary: ${BRANDING.primaryColor};
            --brand-secondary: ${BRANDING.secondaryColor};
          }
        `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${playfairDisplay.variable} font-sans antialiased bg-white text-ink-900 overflow-x-hidden transition-colors duration-500`}
        suppressHydrationWarning
      >
        <SplashScreen />
        <ProgressBarProvider>
        <SmoothScrollProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </SmoothScrollProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}

