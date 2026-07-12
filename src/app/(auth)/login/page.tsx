"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/src/lib/store/authStore";
import type { AuthUser } from "@/src/lib/types/auth";

// Mirrors backend LoginRequest validation exactly:
// @NotBlank + @Email on email, @NotBlank on password.
// We don't add extra client-side rules (like min length)
// that the backend doesn't enforce.
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);


  const [serverError, setServerError] = useState<string | null>(null); 
  // TypeScript tells React that serverError can only be a string or null.
// So setServerError("Login failed") ✅
//    setServerError(null) ✅
//    setServerError(25) ❌ (TypeScript error because 25 is a number)


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

      // Redirect based on role
      if (user.role === "PROVIDER") {
        router.push("/provider/dashboard");
      } else if (user.role === "ADMIN") {
        router.push("/"); // no admin dashboard yet
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Log in to Biteloop</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full border rounded px-3 py-2"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full border rounded px-3 py-2"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-600 text-sm">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}