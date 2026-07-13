"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import type { AuthUser } from "@/lib/types/auth";

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
                router.push("/provider/dashboard");
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
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Create your Biteloop account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Role selection — two clickable cards */}
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
                                        className={`border rounded-lg p-4 text-left transition ${field.value === "CUSTOMER"
                                                ? "border-black bg-gray-50 ring-2 ring-black"
                                                : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <div className="font-semibold">Customer</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            I want to order tiffin/meals
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => field.onChange("PROVIDER")}
                                        className={`border rounded-lg p-4 text-left transition ${field.value === "PROVIDER"
                                                ? "border-black bg-gray-50 ring-2 ring-black"
                                                : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <div className="font-semibold">Provider</div>
                                        <div className="text-sm text-gray-500 mt-1">
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
                            className="w-full border rounded px-3 py-2"
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
                            className="w-full border rounded px-3 py-2"
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
                            className="w-full border rounded px-3 py-2"
                            autoComplete="tel"
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                            Address <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            id="address"
                            type="text"
                            {...register("address")}
                            className="w-full border rounded px-3 py-2"
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
                            className="w-full border rounded px-3 py-2"
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
                        className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>
            </div>
        </main>
    );
}