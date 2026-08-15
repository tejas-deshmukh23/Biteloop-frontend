"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react"; 
// NOTE: "Providers" here is unrelated to the app/provider/ folder
// (that's the Provider *role* — mess/tiffin owners, as opposed to Customers).
// This is the React "provider" pattern: a wrapper component that makes
// the TanStack Query cache available to every component in the tree.

export default function Providers({ children }:{ children: React.ReactNode }) {
  const [queryClient] = useState(
    ()=>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

}

