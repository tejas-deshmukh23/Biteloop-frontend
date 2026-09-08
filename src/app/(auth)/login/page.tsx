"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Fraunces, Work_Sans } from "next/font/google";
import { useAuthStore } from "@/lib/store/authStore";
import type { AuthUser } from "@/lib/types/auth";

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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function isValidRedirectForRole(path: string, role: string): boolean {
  if (role === "PROVIDER") return path.startsWith("/provider");
  if (role === "CUSTOMER")
    return (
      path.startsWith("/dashboard") ||
      path.startsWith("/orders") ||
      path.startsWith("/cart")
    );
  return false;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setServerError(payload.message || "Login failed");
        return;
      }

      const user: AuthUser = payload.data;
      setUser(user);

      const redirectTo = searchParams.get("redirectTo");

      if (redirectTo && isValidRedirectForRole(redirectTo, user.role)) {
        router.push(redirectTo);
      } else if (user.role === "PROVIDER") {
        router.push("/provider/dashboard");
      } else if (user.role === "ADMIN") {
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login request failed", err);
      setServerError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${workSans.className} bg-[#FBF4EC] text-[#2B2013] min-h-screen relative overflow-hidden`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .glow-breathe-1 {
            animation: glowBreathe 7s ease-in-out infinite;
          }
          .glow-breathe-2 {
            animation: glowBreathe 7s ease-in-out infinite;
            animation-delay: 1.5s;
          }
          .live-ping {
            animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .fade-enter {
            animation: fadeEnter 0.6s ease-out both;
          }
        }

        @keyframes glowBreathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.12); }
        }

        @keyframes livePing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes fadeEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-3d {
          position: relative;
          transform: translateY(0);
        }
        .btn-3d:active {
          transform: translateY(3px);
        }
        .btn-3d-primary {
          box-shadow:
            0 4px 0 #8f2a20,
            0 10px 20px -6px rgba(178, 58, 46, 0.45);
        }
        .btn-3d-primary:hover {
          box-shadow:
            0 5px 0 #8f2a20,
            0 14px 24px -6px rgba(178, 58, 46, 0.5);
        }
        .btn-3d-primary:active {
          box-shadow:
            0 1px 0 #8f2a20,
            0 4px 10px -4px rgba(178, 58, 46, 0.4);
        }
        .btn-3d-primary:disabled {
          box-shadow:
            0 4px 0 #8f2a20,
            0 10px 20px -6px rgba(178, 58, 46, 0.3);
          transform: translateY(0);
        }
      `}</style>

      {/* Ambient glow — gently breathing, unlike register's static version,
          since this page can afford a touch more life */}
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 bg-[radial-gradient(circle,rgba(216,155,44,0.3)_0%,transparent_70%)] blur-3xl glow-breathe-1" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 w-96 h-96 bg-[radial-gradient(circle,rgba(178,58,46,0.24)_0%,transparent_70%)] blur-3xl glow-breathe-2" />

      {/* Top bar */}
      <div className="relative max-w-6xl mx-auto px-6 pt-5">
        <header className="flex items-center justify-between rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl px-5 py-3.5 shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
            Biteloop
          </Link>
          <Link href="/register" className="text-sm hover:text-[#B23A2E] transition-colors">
            New here? <span className="font-medium">Create an account</span>
          </Link>
        </header>
      </div>

      {/* Form */}
      <main className="relative flex justify-center px-6 py-16 sm:py-20">
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-[#2B2013]/10 rounded-[28px] shadow-[0_24px_48px_-20px_rgba(43,32,19,0.25)] p-8">
          <div className="fade-enter">
            <h1 className={`${fraunces.className} text-2xl font-semibold mb-1`}>
              Welcome back
            </h1>
            <p className="text-sm text-[#2B2013]/60 mb-4">
              Log in to order or manage your kitchen.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#55713C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#55713C]" />
              </span>
              <span className="text-xs text-[#2B2013]/50">
                Kitchens near you are cooking right now
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="fade-enter" style={{ animationDelay: "80ms" }}>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="fade-enter" style={{ animationDelay: "150ms" }}>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="fade-enter btn-3d btn-3d-primary w-full bg-[#B23A2E] text-white font-medium rounded-full py-3 mt-2 transition-transform disabled:opacity-60"
              style={{ animationDelay: "220ms" }}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF4EC]" />}>
      <LoginForm />
    </Suspense>
  );
}