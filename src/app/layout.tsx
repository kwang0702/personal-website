import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant } from "next/font/google";
import Header from "@/components/header";
import { AdminProvider } from "@/components/admin-provider";
import { LanguageProvider } from "@/components/language-provider";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import PersistentPlayer from "@/components/persistent-player";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "K. Wang",
  description: "Photography, film, music, style, cooking, art, and code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminProvider>
          <LanguageProvider>
            <MusicPlayerProvider>
              <Header />
              {children}
              <PersistentPlayer />
            </MusicPlayerProvider>
          </LanguageProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
