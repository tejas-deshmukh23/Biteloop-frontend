// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Fraunces, Work_Sans } from "next/font/google";
// import { useAuthStore } from "@/lib/store/authStore";

// const fraunces = Fraunces({
//   subsets: ["latin"],
//   weight: ["500", "600"],
//   variable: "--font-fraunces",
// });

// const workSans = Work_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
//   variable: "--font-work-sans",
// });

// export default function ProviderLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const user = useAuthStore((state) => state.user);
//   const clearUser = useAuthStore((state) => state.clearUser);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // A provider on this exact step hasn't registered a business yet —
//   // their token carries no providerId, so Dashboard/Menu would fail
//   // to load anything meaningful. Hide them rather than show broken links.
//   const isOnboarding = pathname?.startsWith("/provider/register");

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//     } catch (err) {
//       console.error("Logout request failed", err);
//     } finally {
//       // Clear client state and redirect regardless of network outcome —
//       // the cookie deletion is best-effort, but the user should not
//       // feel stuck on a logout click.
//       clearUser();
//       router.push("/login");
//     }
//   };

//   return (
//     <div className={`${workSans.className} min-h-screen flex flex-col bg-[#FBF4EC] text-[#2B2013]`}>
//       <div className="max-w-6xl mx-auto w-full px-6 pt-5">
//         <nav className="rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
//           <div className="flex items-center justify-between px-5 py-3.5">
//             <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
//               Biteloop
//             </Link>

//             {/* Desktop links — hidden below md */}
//             {!isOnboarding && (
//               <div className="hidden md:flex items-center gap-7">
//                 <Link
//                   href="/provider/dashboard"
//                   className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/provider/menu"
//                   className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
//                 >
//                   Menu
//                 </Link>
//               </div>
//             )}

//             <div className="hidden md:flex items-center gap-4">
//               {user?.name && (
//                 <span className="text-sm text-[#2B2013]/50">Hi, {user.name}</span>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
//               >
//                 Logout
//               </button>
//             </div>

//             {/* Mobile toggle — only visible below md */}
//             <button
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-label="Toggle menu"
//               aria-expanded={menuOpen}
//               className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#2B2013]/5 transition-colors"
//             >
//               <div className="w-5 flex flex-col gap-1.5">
//                 <span
//                   className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
//                   style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
//                 />
//                 <span
//                   className="h-0.5 bg-[#2B2013] rounded-full transition-opacity"
//                   style={{ opacity: menuOpen ? 0 : 1 }}
//                 />
//                 <span
//                   className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
//                   style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
//                 />
//               </div>
//             </button>
//           </div>

//           {/* Mobile dropdown panel */}
//           {menuOpen && (
//             <div className="md:hidden border-t border-[#2B2013]/10 px-5 py-4 flex flex-col gap-3">
//               {user?.name && (
//                 <span className="text-sm text-[#2B2013]/50 pb-2 border-b border-[#2B2013]/10">
//                   Hi, {user.name}
//                 </span>
//               )}

//               {!isOnboarding && (
//                 <>
//                   <Link
//                     href="/provider/dashboard"
//                     onClick={() => setMenuOpen(false)}
//                     className="text-sm font-medium text-[#2B2013]/80 py-1"
//                   >
//                     Dashboard
//                   </Link>
//                   <Link
//                     href="/provider/menu"
//                     onClick={() => setMenuOpen(false)}
//                     className="text-sm font-medium text-[#2B2013]/80 py-1"
//                   >
//                     Menu
//                   </Link>
//                 </>
//               )}

//               <button
//                 onClick={() => {
//                   setMenuOpen(false);
//                   handleLogout();
//                 }}
//                 className="text-sm font-medium text-[#B23A2E] py-1 text-left"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </nav>
//       </div>

//       <main className="flex-1">{children}</main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
import { useAuthStore } from "@/lib/store/authStore";
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

async function fetchMyProviderProfile(): Promise<Provider> {
  const res = await fetch("/api/providers/me");
  const payload: ApiResponse<Provider> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to fetch provider profile");
  }

  return payload.data;
}

function StatusScreen({
  provider,
  onRefresh,
  refreshing,
}: {
  provider: Provider;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const isRejected = provider.status === "REJECTED";

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: isRejected ? "rgba(178,58,46,0.12)" : "rgba(216,155,44,0.15)" }}
      >
        <span className="text-2xl" style={{ color: isRejected ? "#B23A2E" : "#D89B2C" }}>
          {isRejected ? "✕" : "⏳"}
        </span>
      </div>

      <h1 className={`${fraunces.className} text-2xl font-semibold mb-2`}>
        {isRejected ? "Business not approved" : "Your business is under review"}
      </h1>

      <p className="text-[#2B2013]/60 leading-relaxed mb-1">
        {isRejected
          ? `${provider.businessName} was not approved to join Biteloop.`
          : `${provider.businessName} is awaiting admin approval. This usually doesn't take long.`}
      </p>

      <p className="text-sm text-[#2B2013]/45 mb-6">
        {isRejected
          ? "If you think this is a mistake, please reach out to support."
          : "You'll be able to manage your menu and receive orders once approved."}
      </p>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="text-sm font-medium text-[#B23A2E] hover:text-[#963025] disabled:opacity-50"
      >
        {refreshing ? "Checking..." : "Check status again"}
      </button>
    </div>
  );
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);

  // A provider on this exact step hasn't registered a business yet —
  // their token carries no providerId, so /api/providers/me would fail.
  // Skip the profile fetch and nav-gating entirely on this route.
  const isOnboarding = pathname?.startsWith("/provider/register");

  const {
    data: provider,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorObj,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["provider", "me"],
    queryFn: fetchMyProviderProfile,
    enabled: !isOnboarding,
  });

  const isApproved = provider?.status === "APPROVED";
  // Hide Dashboard/Menu links unless the business is fully approved —
  // a PENDING or REJECTED provider has nothing functional behind those
  // pages yet, so showing the links would just lead to a dead end.
  const hideWorkingNav = isOnboarding || !isApproved;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // Clear client state and redirect regardless of network outcome —
      // the cookie deletion is best-effort, but the user should not
      // feel stuck on a logout click.
      clearUser();
      router.push("/login");
    }
  };

  const renderMain = () => {
    if (isOnboarding) return children;
    if (profileLoading) {
      return (
        <div className="max-w-md mx-auto px-6 py-20 text-center text-[#2B2013]/50">
          Loading your business profile...
        </div>
      );
    }
    if (profileError) {
      return (
        <div className="max-w-md mx-auto px-6 py-20 text-center text-red-600">
          {profileErrorObj instanceof Error
            ? profileErrorObj.message
            : "Couldn't load your business profile."}
        </div>
      );
    }
    if (provider && !isApproved) {
      return (
        <StatusScreen provider={provider} onRefresh={() => refetch()} refreshing={isRefetching} />
      );
    }
    return children;
  };

  return (
    <div className={`${workSans.className} min-h-screen flex flex-col bg-[#FBF4EC] text-[#2B2013]`}>
      <div className="max-w-6xl mx-auto w-full px-6 pt-5">
        <nav className="rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Link href="/" className={`${fraunces.className} text-xl font-semibold`}>
              Biteloop
            </Link>

            {/* Desktop links — hidden below md */}
            {!hideWorkingNav && (
              <div className="hidden md:flex items-center gap-7">
                <Link
                  href="/provider/dashboard"
                  className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/provider/menu"
                  className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
                >
                  Menu
                </Link>
              </div>
            )}

            <div className="hidden md:flex items-center gap-4">
              {user?.name && (
                <span className="text-sm text-[#2B2013]/50">Hi, {user.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-[#2B2013]/70 hover:text-[#B23A2E] transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile toggle — only visible below md */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#2B2013]/5 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
                  style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
                />
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-opacity"
                  style={{ opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="h-0.5 bg-[#2B2013] rounded-full transition-transform"
                  style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
                />
              </div>
            </button>
          </div>

          {/* Mobile dropdown panel */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#2B2013]/10 px-5 py-4 flex flex-col gap-3">
              {user?.name && (
                <span className="text-sm text-[#2B2013]/50 pb-2 border-b border-[#2B2013]/10">
                  Hi, {user.name}
                </span>
              )}

              {!hideWorkingNav && (
                <>
                  <Link
                    href="/provider/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2B2013]/80 py-1"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/provider/menu"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2B2013]/80 py-1"
                  >
                    Menu
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-sm font-medium text-[#B23A2E] py-1 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      <main className="flex-1">{renderMain()}</main>
    </div>
  );
}