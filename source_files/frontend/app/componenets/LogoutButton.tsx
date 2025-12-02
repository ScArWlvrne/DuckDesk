'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../lib/api";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      setSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={signingOut}
      className={`rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
    >
      {signingOut ? "Signing out..." : "Logout"}
    </button>
  );
}
