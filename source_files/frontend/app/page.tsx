'use client'

import Navigate from "./componenets/Navigate";
import TicketSection from "./componenets/TicketSection";
import { useState, useEffect } from "react";
import { getTickets, getCurrentUser, ApiTicket } from "../lib/api";
import { groupTicketsByStatus } from "../lib/ticketMapper";

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  responsible: string;
  modified: string;
  modifiedBy: string;
}

export interface User {
  name: string;
  role: "admin" | "advisor" | "student";
  duckId?: string;
  _95number?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [apiTickets, setApiTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user
        const apiUser = await getCurrentUser();
        if (apiUser) {
          setUser({
            name: apiUser.display_name,
            role: apiUser.role as "admin" | "advisor" | "student",
          });
        }

        // Fetch tickets
        const ticketsResponse = await getTickets();
        setApiTickets(ticketsResponse.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default user if not logged in (for development)
  const displayUser: User = user || { name: "Guest", role: "student" };

  if (loading) {
    return (
      <div className="bg-white relative size-full min-h-screen px-30 py-30 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white relative size-full min-h-screen px-30 py-30 flex items-center justify-center">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Make sure the backend is running on http://localhost:5001</p>
        </div>
      </div>
    );
  }

  const grouped = groupTicketsByStatus(apiTickets);

  return (
    <div className="bg-white relative size-full min-h-screen px-30 py-30" data-name="Advisors view">
      <Navigate user={displayUser} newticket={false} />
      <TicketSection title="In Process" tickets={grouped.inProcess} />
      <TicketSection title="New" tickets={grouped.new} />
      <TicketSection title="closed" tickets={grouped.closed} />
    </div>
  );
}
