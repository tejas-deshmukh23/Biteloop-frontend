"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider } from "@/lib/types/provider";

async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch("/api/providers");
  const payload: ApiResponse<Provider[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch providers");
  }

  return payload.data ?? [];
}

export default function ProvidersPage() {
  const { data: providers, isLoading, isError, error } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading providers...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return <div className="p-6 text-gray-500">No providers available right now.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse Providers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <Link
            key={provider.id}
            href={`/providers/${provider.id}`}
            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-medium">{provider.businessName}</h2>

            {provider.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {provider.description}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2">{provider.address}</p>

            {!provider.deliveryAvailable && (
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Pickup only
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}