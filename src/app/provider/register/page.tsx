"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider, CreateProviderRequest } from "@/lib/types/provider";

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
      <div className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Business registered!</h1>
        <p className="text-gray-600">
          Your business is now awaiting admin approval. For security, please log
          back in to continue — redirecting you now...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Register your business</h1>
      <p className="text-sm text-gray-500 mb-6">
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
            className="w-full border rounded px-3 py-2"
          />
          {errors.businessName && (
            <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full border rounded px-3 py-2"
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
            className="w-full border rounded px-3 py-2"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium mb-1">
              Latitude <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              {...register("latitude")}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium mb-1">
              Longitude <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              {...register("longitude")}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deliveryRadiusKm" className="block text-sm font-medium mb-1">
            Delivery radius (km) <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="deliveryRadiusKm"
            type="number"
            step="any"
            {...register("deliveryRadiusKm")}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="deliveryAvailable"
            type="checkbox"
            {...register("deliveryAvailable")}
            className="w-4 h-4"
          />
          <label htmlFor="deliveryAvailable" className="text-sm font-medium">
            We offer delivery
          </label>
        </div>

        {mutation.isError && (
          <p className="text-red-600 text-sm">{mutation.error.message}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {mutation.isPending ? "Registering..." : "Register business"}
        </button>
      </form>
    </div>
  );
}