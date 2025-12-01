'use client'

import Navigate from "../componenets/Navigate";
import EditForm from "../componenets/EditTicket"
import { useState, useEffect } from "react";
import { getCurrentUser, ApiUser } from "../../lib/api";

export interface User {
  name: string;
  role: "admin" | "advisor" | "student";
  duckId?: string;
  _95number?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
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
      <div className="pt-[120px] pb-12">
        <EditForm />
      </div>
    </div>
  );
}
