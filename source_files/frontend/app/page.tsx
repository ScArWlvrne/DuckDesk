'use client'

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AdvisorDashboard from "./componenets/AdvisorDashboard";
import StudentDashboard from "./componenets/StudentDashboard";
import Navigate from "./componenets/Navigate";
import TicketSection from "./componenets/TicketSection";
import {
  getTickets,
  getCurrentUser,
  ApiTicket,
  getArchivedTickets,
} from "../lib/api";
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
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [apiTickets, setApiTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewArchived, setViewArchived] = useState<boolean>(() => {
    // Seed archived toggle from URL so links can deep-link to archived view.
    const viewParam = searchParams.get("view");
    const archivedParam = searchParams.get("archived");
    return (
      viewParam === "archived" ||
      archivedParam === "1" ||
      archivedParam?.toLowerCase() === "true"
    );
  });

  useEffect(() => {
    const viewParam = searchParams.get("view");
    const archivedParam = searchParams.get("archived");
    const shouldShowArchived =
      viewParam === "archived" ||
      archivedParam === "1" ||
      archivedParam?.toLowerCase() === "true";
    setViewArchived(shouldShowArchived);
  }, [searchParams]);

  const loadTickets = useCallback(async (activeFilters: FilterState, archived: boolean) => {
    // Pull tickets with the current filter state; this is the single place we build query params.
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        per_page: 200, // pull a larger slice so all statuses show in the "All" view
      };
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
      const fetchTickets = archived ? getArchivedTickets : getTickets;
      const ticketsResponse = await fetchTickets(params);
      setApiTickets(ticketsResponse.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialView = viewArchived;
    const fetchData = async () => {
      // Bootstraps the page: fetch current user, then initial ticket list.
      setLoading(true);
      setError(null);
      try {
        const apiUser = await getCurrentUser();
        if (!apiUser) {
          // User is not logged in, redirect to login page
          window.location.href = "/login";
          return;
        }
        setUser({
          id: apiUser.user_id,
          name: apiUser.display_name,
          role: apiUser.role as "admin" | "advisor" | "student",
        });
        await loadTickets(defaultFilters, initialView);
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
    // Merge incoming updates, then refetch with the combined filters.
    const nextFilters = { ...filters, ...updates };
    setFilters(nextFilters);
    loadTickets(nextFilters, viewArchived);
  };

  const resetFilters = () => {
    // Reset to defaults and refetch the current view (active or archived).
    setFilters(defaultFilters);
    loadTickets(defaultFilters, viewArchived);
  };

  const handleToggleArchivedView = (archived: boolean) => {
    // Toggle active vs archived queues; preserves current filters.
    setViewArchived(archived);
    loadTickets(filters, archived);
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
            Make sure the backend is running on http://127.0.0.1:5000
          </p>
        </div>
      </div>
    );
  }

  if (isAdvisorView) {
    return (
      <div className="relative min-h-screen bg-slate-50">
        <Navigate user={displayUser} newticket={false} />
        <div className="px-4 py-6 pt-[120px] sm:px-6 md:pt-[100px] lg:px-12 lg:pt-[120px]">
          <AdvisorDashboard
            user={displayUser}
            tickets={apiTickets}
            filters={filters}
            loading={loading}
            viewArchived={viewArchived}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onToggleArchived={handleToggleArchivedView}
          />
        </div>
      </div>
    );
  }

  // Render student-facing dashboard (same layout as advisor but no priority column)
  return (
    <div className="relative min-h-screen bg-slate-50">
      <Navigate user={displayUser} newticket={false} />
      <div className="px-4 py-6 pt-[120px] sm:px-6 md:pt-[100px] lg:px-12 lg:pt-[120px]">
        <StudentDashboard
          user={displayUser}
          tickets={apiTickets}
          filters={filters}
          loading={loading}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
  );
}
