"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider } from "@/lib/types/provider";

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

async function fetchPendingProviders(): Promise<Provider[]> {
  const res = await fetch("/api/admin/providers/pending");
  const payload: ApiResponse<Provider[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch pending providers");
  }

  return payload.data ?? [];
}

async function approveProvider(id: string): Promise<Provider> {
  const res = await fetch(`/api/admin/providers/${id}/approve`, { method: "PUT" });
  const payload: ApiResponse<Provider> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to approve provider");
  }

  return payload.data;
}

async function rejectProvider(id: string): Promise<Provider> {
  const res = await fetch(`/api/admin/providers/${id}/reject`, { method: "PUT" });
  const payload: ApiResponse<Provider> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to reject provider");
  }

  return payload.data;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 p-5 h-[140px]"
      style={{ animationDelay: `${index * 100}ms` }}
    />
  );
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [errorId, setErrorId] = useState<string | null>(null);

  const {
    data: providers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["providers", "admin", "pending"],
    queryFn: fetchPendingProviders,
  });

  const approveMutation = useMutation<Provider, Error, string>({
    mutationFn: approveProvider,
    onMutate: () => setErrorId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers", "admin", "pending"] });
    },
    onError: (err, id) => {
      setErrorId(id);
      console.error("Approve failed", err);
    },
  });

  const rejectMutation = useMutation<Provider, Error, string>({
    mutationFn: rejectProvider,
    onMutate: () => setErrorId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers", "admin", "pending"] });
    },
    onError: (err, id) => {
      setErrorId(id);
      console.error("Reject failed", err);
    },
  });

  const handleReject = (id: string) => {
    const confirmed = window.confirm(
      "Reject this business? They will not be able to appear on Biteloop."
    );
    if (!confirmed) return;
    rejectMutation.mutate(id);
  };

  return (
    <div className={`${workSans.className} max-w-4xl mx-auto px-6 py-8`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter { animation: rowEnter 0.4s ease-out both; }
          .skeleton-pulse { animation: skeletonPulse 1.4s ease-in-out infinite; }
        }
        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .btn-3d { position: relative; transform: translateY(0); }
        .btn-3d:active { transform: translateY(2px); }
        .btn-3d-green { box-shadow: 0 3px 0 #3f5a2c; }
        .btn-3d-green:active { box-shadow: 0 1px 0 #3f5a2c; }
        .btn-3d-green:disabled { box-shadow: 0 3px 0 #3f5a2c; transform: translateY(0); opacity: 0.6; }
      `}</style>

      <div className="mb-6">
        <h1 className={`${fraunces.className} text-3xl font-semibold`}>Provider Approvals</h1>
        <p className="text-[#2B2013]/55 mt-1">
          Review new businesses before they go live on Biteloop.
        </p>
      </div>

      {isError && (
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Failed to load pending providers"}
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      )}

      {!isLoading && providers && providers.length === 0 && (
        <div className="rounded-2xl border border-[#2B2013]/10 bg-white/70 p-8 text-center">
          <p className="text-[#2B2013]/55">No businesses waiting for review right now.</p>
        </div>
      )}

      {!isLoading && providers && providers.length > 0 && (
        <div className="space-y-3">
          {providers.map((provider, index) => {
            const isApproving = approveMutation.isPending && approveMutation.variables === provider.id;
            const isRejecting = rejectMutation.isPending && rejectMutation.variables === provider.id;
            const isBusy = isApproving || isRejecting;
            const hasError =
              errorId === provider.id && (approveMutation.isError || rejectMutation.isError);

            return (
              <div
                key={provider.id}
                className="row-enter rounded-2xl border-l-4 border-l-[#D89B2C] bg-white/70 backdrop-blur-sm p-5"
                style={{
                  animationDelay: `${Math.min(index * 60, 300)}ms`,
                  borderTop: "1px solid rgba(43,32,19,0.08)",
                  borderRight: "1px solid rgba(43,32,19,0.08)",
                  borderBottom: "1px solid rgba(43,32,19,0.08)",
                }}
              >
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <h2 className={`${fraunces.className} text-lg font-semibold`}>
                      {provider.businessName}
                    </h2>
                    {provider.description && (
                      <p className="text-sm text-[#2B2013]/60 mt-1">{provider.description}</p>
                    )}
                    <p className="text-sm text-[#2B2013]/50 mt-1">{provider.address}</p>
                    <p className="text-xs text-[#2B2013]/40 mt-1">
                      Registered {new Date(provider.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-[#D89B2C] bg-[#D89B2C]/12 px-2.5 py-1 rounded-full shrink-0">
                    Pending
                  </span>
                </div>

                {hasError && (
                  <p className="text-red-600 text-sm mt-2">
                    {(approveMutation.error || rejectMutation.error)?.message}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => approveMutation.mutate(provider.id)}
                    disabled={isBusy}
                    className="btn-3d btn-3d-green bg-[#55713C] text-white text-sm font-medium px-4 py-2 rounded-full transition-transform disabled:cursor-not-allowed"
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleReject(provider.id)}
                    disabled={isBusy}
                    className="text-sm font-medium px-4 py-2 rounded-full text-[#B23A2E] border border-[#B23A2E]/25 hover:bg-[#B23A2E]/5 transition-colors disabled:opacity-50"
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}