'use client'

import { useState, useEffect, useCallback } from "react";
import AdvisorDashboard from "./componenets/AdvisorDashboard";
import Navigate from "./componenets/Navigate";
import TicketSection from "./componenets/TicketSection";
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
  id?: number;
  name: string;
  role: "admin" | "advisor" | "student";
  duckId?: string;
  _95number?: string;
}

export type FilterState = {
  status: "all" | "0" | "1" | "2" | "3";
  priority: "all" | "1" | "2" | "3";
  department: "all" | string;
  text: string;
};

const defaultFilters: FilterState = {
  status: "all",
  priority: "all",
  department: "all",
  text: "",
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [apiTickets, setApiTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const loadTickets = useCallback(async (activeFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (activeFilters.status !== "all") {
        params.status = Number(activeFilters.status);
      }
      if (activeFilters.priority !== "all") {
        params.priority = Number(activeFilters.priority);
      }
      if (activeFilters.department !== "all") {
        params.department = Number(activeFilters.department);
      }
      if (activeFilters.text.trim()) {
        params.text = activeFilters.text.trim();
      }
      const ticketsResponse = await getTickets(params);
      setApiTickets(ticketsResponse.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUser = await getCurrentUser();
        if (apiUser) {
          setUser({
            id: apiUser.user_id,
            name: apiUser.display_name,
            role: apiUser.role as "admin" | "advisor" | "student",
          });
        }
        await loadTickets(defaultFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadTickets]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    const nextFilters = { ...filters, ...updates };
    setFilters(nextFilters);
    loadTickets(nextFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    loadTickets(defaultFilters);
  };

  const displayUser: User = user || { name: "Guest", role: "student" };
  const isAdvisorView =
    displayUser.role === "advisor" || displayUser.role === "admin";

  if (error) {
    return (
      <div className="bg-white relative size-full min-h-screen px-6 py-12 flex items-center justify-center">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">
            Make sure the backend is running on http://localhost:5001
          </p>
        </div>
      </div>
    );
  }

  if (isAdvisorView) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-12">
        <AdvisorDashboard
          user={displayUser}
          tickets={apiTickets}
          filters={filters}
          loading={loading}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />
      </div>
    );
  }

  const grouped = groupTicketsByStatus(apiTickets);

  return (
    <div
      className="bg-white relative size-full min-h-screen px-8 py-12"
      data-name="Student view"
    >
      <Navigate user={displayUser} newticket={false} />
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-600">
          Loading tickets...
        </div>
      ) : (
        <>
          <TicketSection title="In Process" tickets={grouped.inProcess} />
          <TicketSection title="New" tickets={grouped.new} />
          <TicketSection title="closed" tickets={grouped.closed} />
        </>
      )}
    </div>
  );
}
