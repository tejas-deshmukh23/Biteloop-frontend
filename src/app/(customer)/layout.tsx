"use client";

import { useState } from "react";
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

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // Clear client state and redirect regardless of network outcome —
      // the cookie deletion is best-effort, but the user should not
      // feel stuck on a logout click.
      clearUser();
      router.push("/login");
    }
  };

  return (
    <div className={`${workSans.className} min-h-screen flex flex-col bg-[#FBF4EC] text-[#2B2013]`}>
      <div className="max-w-6xl mx-auto w-full px-6 pt-5">
        <nav className="rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
              Biteloop
            </Link>

            {/* Desktop links — hidden below md */}
            {user && (
              <div className="hidden md:flex items-center gap-7">
                <Link
                  href="/dashboard"
                  className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                >
                  Orders
                </Link>
              </div>
            )}

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-[#2B2013]/50">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[#B23A2E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#963025] transition-colors"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle — only visible below md */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#2B2013]/5 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
                  style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
                />
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-opacity"
                  style={{ opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
                  style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
                />
              </div>
            </button>
          </div>

          {/* Mobile dropdown panel */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#2B2013]/10 px-5 py-4 flex flex-col gap-3">
              {user ? (
                <>
                  <span className="text-sm text-[#2B2013]/50 pb-2 border-b border-[#2B2013]/10">
                    Hi, {user.name}
                  </span>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2B2013]/80 py-1"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2B2013]/80 py-1"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm font-medium text-[#B23A2E] py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2B2013]/80 py-1"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#B23A2E] text-white text-sm font-medium px-4 py-2 rounded-full text-center"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}