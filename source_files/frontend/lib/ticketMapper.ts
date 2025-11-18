/**
 * Utility functions to map between backend API data and frontend data structures
 */

import { ApiTicket } from './api';
import { Ticket } from '../app/page';

/**
 * Map backend ticket status to frontend status string
 */
function mapStatus(status: number): string {
  switch (status) {
    case 0:
      return 'closed';
    case 1:
      return 'New';
    case 2:
      return 'In Process'; // AWAITING_AUTHOR
    case 3:
      return 'In Process'; // AWAITING_ASSIGNEE
    default:
      return 'New';
  }
}

/**
 * Convert API ticket to frontend ticket format
 */
export function mapApiTicketToFrontendTicket(apiTicket: ApiTicket): Ticket {
  return {
    id: apiTicket.ticket_id.toString(),
    title: apiTicket.subject,
    requester: apiTicket.author_name || `User ${apiTicket.author_id}`,
    responsible: apiTicket.assignee_name || 'Unassigned',
    modified: new Date(apiTicket.last_updated).toISOString().split('T')[0],
    modifiedBy: apiTicket.assignee_name || 'System',
  };
}

/**
 * Group tickets by status for display in sections
 * Note: This is a simple grouping. You may want to filter by status from the API instead.
 */
export function groupTicketsByStatus(apiTickets: ApiTicket[]): {
  new: Ticket[];
  inProcess: Ticket[];
  closed: Ticket[];
} {
  const tickets = apiTickets.map(mapApiTicketToFrontendTicket);
  
  return {
    new: tickets.filter(t => {
      // Status 1 is OPEN and typically means new/unassigned
      const apiTicket = apiTickets.find(at => at.ticket_id.toString() === t.id);
      return apiTicket?.status === 1;
    }),
    inProcess: tickets.filter(t => {
      // Status 2 (AWAITING_AUTHOR) or 3 (AWAITING_ASSIGNEE) means in process
      const apiTicket = apiTickets.find(at => at.ticket_id.toString() === t.id);
      return apiTicket?.status === 2 || apiTicket?.status === 3;
    }),
    closed: tickets.filter(t => {
      // Status 0 is CLOSED
      const apiTicket = apiTickets.find(at => at.ticket_id.toString() === t.id);
      return apiTicket?.status === 0;
    }),
  };
}

