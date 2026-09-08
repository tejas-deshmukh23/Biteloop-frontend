"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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

// Mirrors backend RegisterRequest validation exactly:
// name @NotBlank @Size(2,100), email @NotBlank @Email,
// password @NotBlank @Size(6,50), phone @NotBlank @Pattern(Indian mobile),
// address optional, role @NotNull
const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be between 2 and 100 characters")
    .max(100, "Name must be between 2 and 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be between 6 and 50 characters")
    .max(50, "Password must be between 6 and 50 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  address: z.string().optional(),
  role: z.enum(["CUSTOMER", "PROVIDER"], {
    error: () => "Please select an account type",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setServerError(payload.message || "Registration failed");
        return;
      }

      const user: AuthUser = payload.data;
      setUser(user);

      if (user.role === "PROVIDER") {
        // router.push("/provider/dashboard");
        router.push("/provider/register");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Register request failed", err);
      setServerError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${workSans.className} bg-[#FBF4EC] text-[#2B2013] min-h-screen relative overflow-hidden`}>
      <style jsx global>{`
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
        .form-card-enter {
          animation: formCardEnter 0.6s ease-out both;
        }
        @keyframes formCardEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Ambient glow, static — atmosphere without competing with the form */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[radial-gradient(circle,rgba(216,155,44,0.28)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[radial-gradient(circle,rgba(178,58,46,0.2)_0%,transparent_70%)] blur-3xl" />

      {/* Top bar */}
      <div className="relative max-w-6xl mx-auto px-6 pt-5">
        <header className="flex items-center justify-between rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl px-5 py-3.5 shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
            Biteloop
          </Link>
          <Link href="/login" className="text-sm hover:text-[#B23A2E] transition-colors">
            Already have an account? <span className="font-medium">Log in</span>
          </Link>
        </header>
      </div>

      {/* Form */}
      <main className="relative flex justify-center px-6 py-12">
        <div className="form-card-enter w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#2B2013]/10 rounded-[28px] shadow-[0_24px_48px_-20px_rgba(43,32,19,0.25)] p-8">
          <h1 className={`${fraunces.className} text-2xl font-semibold mb-1`}>
            Create your account
          </h1>
          <p className="text-sm text-[#2B2013]/60 mb-6">
            Join Biteloop as a customer or list your kitchen.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("CUSTOMER")}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        field.value === "CUSTOMER"
                          ? "border-2 border-[#B23A2E] bg-[#B23A2E]/5 shadow-[0_6px_16px_-8px_rgba(178,58,46,0.4)]"
                          : "border border-[#2B2013]/15 hover:border-[#2B2013]/30"
                      }`}
                    >
                      <div className="font-semibold">Customer</div>
                      <div className="text-sm text-[#2B2013]/60 mt-1">
                        I want to order tiffin/meals
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("PROVIDER")}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        field.value === "PROVIDER"
                          ? "border-2 border-[#D89B2C] bg-[#D89B2C]/10 shadow-[0_6px_16px_-8px_rgba(216,155,44,0.4)]"
                          : "border border-[#2B2013]/15 hover:border-[#2B2013]/30"
                      }`}
                    >
                      <div className="font-semibold">Provider</div>
                      <div className="text-sm text-[#2B2013]/60 mt-1">
                        I run a mess/tiffin service
                      </div>
                    </button>
                  </div>
                )}
              />
              {errors.role && (
                <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
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

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                {...register("phone")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address <span className="text-[#2B2013]/40">(optional)</span>
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="street-address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-3d btn-3d-primary w-full bg-[#B23A2E] text-white font-medium rounded-full py-3 mt-2 transition-transform disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}