// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react"; 
// // NOTE: "Providers" here is unrelated to the app/provider/ folder
// // (that's the Provider *role* — mess/tiffin owners, as opposed to Customers).
// // This is the React "provider" pattern: a wrapper component that makes
// // the TanStack Query cache available to every component in the tree.

// export default function Providers({ children }:{ children: React.ReactNode }) {
//   const [queryClient] = useState(
//     ()=>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 30 * 1000,
//             retry: 1,
//           }
//         }
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );

// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiResponse, AuthUser } from "@/lib/types/auth";

// NOTE: "Providers" here is unrelated to the app/provider/ folder
// (that's the Provider *role* — mess/tiffin owners, as opposed to Customers).
// This is the React "provider" pattern: a wrapper component that makes
// the TanStack Query cache available to every component in the tree.

function AuthRehydrator({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      try {
        const res = await fetch("/api/auth/me");
        const payload: ApiResponse<AuthUser> = await res.json();

        // Not logged in (401) is expected and silent — anonymous visitors
        // on public pages like /providers shouldn't see any warning here.
        if (!cancelled && res.ok && payload.success && payload.data) {
          setUser(payload.data);
        }
      } catch (err) {
        // Network failure on rehydration shouldn't block the app —
        // worst case, "Hi, {name}" stays blank until next navigation
        console.error("Auth rehydration failed", err);
      }
    }

    rehydrate();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthRehydrator>{children}</AuthRehydrator>
    </QueryClientProvider>
  );
}