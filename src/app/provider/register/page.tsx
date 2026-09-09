"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Fraunces, Work_Sans } from "next/font/google";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider, CreateProviderRequest } from "@/lib/types/provider";

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

// Mirrors backend CreateProviderRequest validation exactly:
// businessName @NotBlank @Size(2,150), address @NotBlank,
// description @Size(max 500) optional, lat/long/radius optional numbers,
// deliveryAvailable defaults false
const providerSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be between 2 and 150 characters")
    .max(150, "Business name must be between 2 and 150 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  address: z.string().min(1, "Address is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  deliveryRadiusKm: z.string().optional(),
  deliveryAvailable: z.boolean(),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

async function registerProvider(request: CreateProviderRequest): Promise<Provider> {
  const res = await fetch("/api/providers/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload: ApiResponse<Provider> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to register provider");
  }

  return payload.data;
}

export default function ProviderRegisterPage() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: { deliveryAvailable: false },
  });

  const mutation = useMutation<Provider, Error, CreateProviderRequest>({
    mutationFn: registerProvider,
    onSuccess: async () => {
      setShowSuccess(true);

      // Business is now linked to this account server-side, but the
      // current JWT was minted before that happened — it still carries
      // no providerId. Force a fresh login so the next token includes it.
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout after provider registration failed", err);
      } finally {
        clearUser();
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    },
  });

  const onSubmit = (values: ProviderFormValues) => {
    mutation.mutate({
      businessName: values.businessName,
      description: values.description || undefined,
      address: values.address,
      latitude: values.latitude ? Number(values.latitude) : undefined,
      longitude: values.longitude ? Number(values.longitude) : undefined,
      deliveryRadiusKm: values.deliveryRadiusKm ? Number(values.deliveryRadiusKm) : undefined,
      deliveryAvailable: values.deliveryAvailable,
    });
  };

  if (showSuccess) {
    return (
      <div className={`${workSans.className} max-w-md mx-auto px-6 py-16 text-center`}>
        <div className="w-14 h-14 rounded-full bg-[#55713C]/12 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-[#55713C]">✓</span>
        </div>
        <h1 className={`${fraunces.className} text-2xl font-semibold mb-2`}>
          Business registered!
        </h1>
        <p className="text-[#2B2013]/60 leading-relaxed">
          Your business is now awaiting admin approval. For security, please
          log back in to continue — redirecting you now...
        </p>
      </div>
    );
  }

  return (
    <div className={`${workSans.className} flex justify-center px-6 py-10`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .fade-enter {
            animation: fadeEnter 0.5s ease-out both;
          }
        }
        @keyframes fadeEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-3d {
          position: relative;
          transform: translateY(0);
        }
        .btn-3d:active {
          transform: translateY(2px);
        }
        .btn-3d-primary {
          box-shadow: 0 4px 0 #8f2a20;
        }
        .btn-3d-primary:active {
          box-shadow: 0 1px 0 #8f2a20;
        }
        .btn-3d-primary:disabled {
          box-shadow: 0 4px 0 #8f2a20;
          transform: translateY(0);
          opacity: 0.6;
        }
      `}</style>

      <div className="fade-enter w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#2B2013]/10 rounded-[28px] shadow-[0_24px_48px_-20px_rgba(43,32,19,0.25)] p-8">
        <h1 className={`${fraunces.className} text-2xl font-semibold mb-1`}>
          Register your business
        </h1>
        <p className="text-sm text-[#2B2013]/60 mb-6">
          Set up your mess/tiffin business profile to start receiving orders.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium mb-1">
              Business name
            </label>
            <input
              id="businessName"
              type="text"
              {...register("businessName")}
              className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
            />
            {errors.businessName && (
              <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description <span className="text-[#2B2013]/40">(optional)</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register("address")}
              className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium mb-1">
                Latitude <span className="text-[#2B2013]/40">(optional)</span>
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                {...register("latitude")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium mb-1">
                Longitude <span className="text-[#2B2013]/40">(optional)</span>
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                {...register("longitude")}
                className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryRadiusKm" className="block text-sm font-medium mb-1">
              Delivery radius (km) <span className="text-[#2B2013]/40">(optional)</span>
            </label>
            <input
              id="deliveryRadiusKm"
              type="number"
              step="any"
              {...register("deliveryRadiusKm")}
              className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
            />
          </div>

          <label
            htmlFor="deliveryAvailable"
            className="flex items-center gap-2.5 rounded-xl border border-[#2B2013]/15 px-3 py-2.5 cursor-pointer hover:border-[#2B2013]/25 transition-colors"
          >
            <input
              id="deliveryAvailable"
              type="checkbox"
              {...register("deliveryAvailable")}
              className="w-4 h-4 accent-[#D89B2C]"
            />
            <span className="text-sm font-medium">We offer delivery</span>
          </label>

          {mutation.isError && (
            <p className="text-red-600 text-sm">{mutation.error.message}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-3d btn-3d-primary w-full bg-[#B23A2E] text-white font-medium rounded-full py-3 mt-2 transition-transform disabled:opacity-60"
          >
            {mutation.isPending ? "Registering..." : "Register business"}
          </button>
        </form>
      </div>
    </div>
  );
}