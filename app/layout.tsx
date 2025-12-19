import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Baatein - A quiet place to put your thoughts down",
    template: "%s | Baatein",
  },
  description:
    "A minimalist journaling application designed to provide a calm, distraction-free space for personal reflection and writing. Your thoughts, safely held.",
  keywords: [
    "journaling",
    "journal app",
    "private journal",
    "personal reflection",
    "mindfulness",
    "mental health",
    "writing",
    "diary",
    "secure journaling",
    "minimalist app",
  ],
  authors: [{ name: "Aaditya Paul" }],
  creator: "Aaditya Paul",
  publisher: "Aaditya Paul",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Baatein - A quiet place to put your thoughts down",
    description:
      "A minimalist journaling application designed to provide a calm, distraction-free space for personal reflection and writing.",
    siteName: "Baatein",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 1200,
        alt: "Baatein - A quiet place to put your thoughts down",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baatein - A quiet place to put your thoughts down",
    description:
      "A minimalist journaling application for personal reflection and writing.",
    images: ["/opengraph-image"],
    creator: "@yourtwitterhandle", // Update this with actual Twitter handle if available
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          closeButton
          position="top-center"
          expand={false}
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}
