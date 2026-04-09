'use client'

import Navigate from "../componenets/Navigate";
import EditForm from "../componenets/EditTicket";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  role: "admin" | "advisor" | "student";
  duckId?: string;
  _95number?: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch current user to render nav and gate the form experience.
      try {
        const apiUser = await getCurrentUser();
        if (apiUser) {
          setUser({
            name: apiUser.display_name,
            role: apiUser.role as "admin" | "advisor" | "student",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="bg-white relative size-full min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const displayUser: User = user || { name: "Guest", role: "student" };

  return (
    <div className="bg-white relative size-full min-h-screen px-8" data-name="New Ticket view">
      <Navigate user={displayUser} newticket={true} />
      <div className="flex items-center justify-between pt-[120px] pb-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Back to dashboard
        </button>
      </div>
      <div className="pb-12">
        <EditForm />
      </div>
    </div>
  );
}
