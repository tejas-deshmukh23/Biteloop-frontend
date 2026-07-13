"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

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

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold">Biteloop</span>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
            Dashboard
          </Link>
          <Link href="/orders" className="text-sm text-gray-600 hover:text-black">
            Orders
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user?.name && (
            <span className="text-sm text-gray-500">Hi, {user.name}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}