import { Providers } from "./_providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from '@/components/navbar/navbar'
import { CookieBanner } from "@/components/cookie-banner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "КандидатАйКю - Система оценки кандидатов",
  description: "Создавайте и управляйте формами для оценки кандидатов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          <main className="pt-14">
            {children}
          </main>
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}
