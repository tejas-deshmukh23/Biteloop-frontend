"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

const ACCENTS = [
  { hex: "#B23A2E", tint: "rgba(178,58,46,0.16)", shadow: "rgba(178,58,46,0.35)" },
  { hex: "#D89B2C", tint: "rgba(216,155,44,0.18)", shadow: "rgba(216,155,44,0.35)" },
  { hex: "#55713C", tint: "rgba(85,113,60,0.16)", shadow: "rgba(85,113,60,0.35)" },
];

async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch("/api/providers");
  const payload: ApiResponse<Provider[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch providers");
  }

  return payload.data ?? [];
}

function ProviderCard({ provider, index }: { provider: Provider; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const accent = ACCENTS[index % ACCENTS.length];

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({ x: (py - 0.5) * -6, y: (px - 0.5) * 8 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const handleLeave = () => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="card-enter"
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms`, perspective: "800px" }}
    >
      <Link
        href={`/providers/${provider.id}`}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovering ? -4 : 0}px)`,
          transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
          boxShadow: hovering
            ? `0 20px 32px -14px ${accent.shadow}`
            : "0 6px 16px -10px rgba(43,32,19,0.15)",
        }}
        className="relative block rounded-2xl border border-[#2B2013]/10 bg-white/80 backdrop-blur-sm p-5 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${accent.tint}, transparent 60%)`,
          }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`${fraunces.className} w-11 h-11 rounded-full flex items-center justify-center text-white text-lg font-semibold shrink-0`}
              style={{ backgroundColor: accent.hex }}
            >
              {provider.businessName.charAt(0).toUpperCase()}
            </div>

            {provider.deliveryAvailable ? (
              <span className="flex items-center gap-1.5 text-xs text-[#55713C] font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#55713C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#55713C]" />
                </span>
                Delivers to you
              </span>
            ) : (
              <span className="text-xs bg-[#2B2013]/5 text-[#2B2013]/60 px-2 py-1 rounded-full">
                Pickup only
              </span>
            )}
          </div>

          <h2 className={`${fraunces.className} text-lg font-semibold mb-1`}>
            {provider.businessName}
          </h2>

          {provider.description && (
            <p className="text-sm text-[#2B2013]/65 line-clamp-2 mb-2 leading-relaxed">
              {provider.description}
            </p>
          )}

          <p className="text-sm text-[#2B2013]/50">{provider.address}</p>
        </div>
      </Link>
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 p-5 h-[168px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-11 h-11 rounded-full bg-[#2B2013]/10 mb-3" />
      <div className="h-4 bg-[#2B2013]/10 rounded w-2/3 mb-2" />
      <div className="h-3 bg-[#2B2013]/10 rounded w-full mb-1.5" />
      <div className="h-3 bg-[#2B2013]/10 rounded w-1/2" />
    </div>
  );
}

export default function ProvidersPage() {
  const { data: providers, isLoading, isError, error } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  return (
    <div className={workSans.className}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .card-enter {
            animation: cardEnter 0.55s ease-out both;
          }
          .live-ping {
            animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .skeleton-pulse {
            animation: skeletonPulse 1.4s ease-in-out infinite;
          }
        }

        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes livePing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className={`${fraunces.className} text-3xl font-semibold mb-1`}>
          Browse kitchens near you
        </h1>
        <p className="text-[#2B2013]/60 mb-8">
          Real home-style meals, made fresh by local kitchens.
        </p>

        {isError && (
          <div className="text-red-600">
            {error instanceof Error ? error.message : "Something went wrong"}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && providers && providers.length === 0 && (
          <div className="text-[#2B2013]/60">No providers available right now.</div>
        )}

        {!isLoading && !isError && providers && providers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((provider, index) => (
              <ProviderCard key={provider.id} provider={provider} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}