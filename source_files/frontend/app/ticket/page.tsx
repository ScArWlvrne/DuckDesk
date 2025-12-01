'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getTicketDetails, TicketDetails } from "../../lib/api";
import Header from "../componenets/ticket/header";
import Description from "../componenets/ticket/description";
import TestimonialWall from "../componenets/ticket/details";
import Chain from "../componenets/ticket/response";

export default function TicketPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError('No ticket ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const details = await getTicketDetails(ticketId);
        setTicketDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ticket');
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading ticket...</div>
      </div>
    );
  }

  if (error || !ticketDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <p>Error: {error || 'Ticket not found'}</p>
        </div>
      </div>
    );
  }

  const statusMap: Record<string, string> = {
    'OPEN': 'open',
    'CLOSED': 'closed',
    'AWAITING_AUTHOR': 'awaiting_author',
    'AWAITING_ASSIGNEE': 'awaiting_assignee',
  };

  const status = ticketDetails.status ? statusMap[ticketDetails.status] || 'open' : 'open';

  return (
    <>
      <Header 
        title={ticketDetails.subject} 
        ticketId={ticketId || ''} 
        status={status} 
      />
      <Description description={ticketDetails.body} />
      <TestimonialWall
        assignee={ticketDetails.assignee}
        lastUpdated={ticketDetails.last_updated}
        modifiedBy={ticketDetails.assignee || ticketDetails.author}
        department={ticketDetails.department}
        requester={ticketDetails.author}
        createdAt={ticketDetails.created_at}
        studentNumber={ticketId || undefined}
      />
      <Chain responses={ticketDetails.responses} />
    </>
  );
}
