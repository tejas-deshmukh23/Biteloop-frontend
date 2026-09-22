"use client";

import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${workSans.className} bg-[#FBF4EC] text-[#2B2013] min-h-screen`}>
      <div className="max-w-4xl mx-auto px-6 pt-5">
        <header className="flex items-center justify-between rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl px-5 py-3.5 shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
            Biteloop
          </Link>
          <Link href="/" className="text-sm hover:text-[#B23A2E] transition-colors">
            ← Back home
          </Link>
        </header>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className={`${fraunces.className} text-3xl font-semibold mb-2`}>{title}</h1>
        <p className="text-sm text-[#2B2013]/45 mb-10">Last updated: {updated}</p>
        <div className="space-y-6 text-[#2B2013]/80 leading-relaxed [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-[#2B2013] [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-6 pb-10 text-sm text-[#2B2013]/45 flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/terms" className="hover:text-[#B23A2E] transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-[#B23A2E] transition-colors">Privacy Policy</Link>
        <Link href="/refund-policy" className="hover:text-[#B23A2E] transition-colors">Refund Policy</Link>
        <Link href="/contact" className="hover:text-[#B23A2E] transition-colors">Contact Us</Link>
      </footer>
    </div>
  );
}