"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Work_Sans } from "next/font/google";
import { useAuthStore } from "@/lib/store/authStore";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      clearUser();
      router.push("/login");
    }
  };

  return (
    <div className={`${workSans.className} min-h-screen flex flex-col bg-[#FBF4EC] text-[#2B2013]`}>
      <div className="max-w-6xl mx-auto w-full px-6 pt-5">
        <nav className="flex items-center justify-between rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl px-5 py-3.5 shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <div className="flex items-center gap-3">
            <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
              Biteloop
            </Link>
            <span className="text-xs font-medium text-[#2B2013]/40 bg-[#2B2013]/5 px-2 py-1 rounded-full">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="text-sm text-[#2B2013]/50 hidden sm:inline">Hi, {user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}