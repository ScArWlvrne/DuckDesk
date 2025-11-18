'use client'

import Navigate from "../componenets/Navigate";
import EditForm from "../componenets/EditTicket"
import { useState, useEffect, use } from "react";


export interface User {
  name: string;
  role: "admin" | "advisor" | "student";
  duckId?: string;
  _95number?: string;
}

// const [user, setUser] = useState<User | null>(null);
// useEffect(() => {
//   // Simulate fetching user data
//   const fetchUser = async () => {
//     const response = await fetch("/api/user");  // TODO: replace with actual API endpoint
//     const data = await response.json();
//     setUser(data);
//   };

//   fetchUser();
// }, []);

const temp_user: User = { name: "John Doe", role: "admin", duckId: "jdoe123", _95number: "95-12345" };

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  responsible: string;
  modified: string;
  modifiedBy: string;
}

// const [tickets, setTickets] = useState<Ticket[]>([]);
// useEffect(() => {
//   // Simulate fetching ticket data
//   const fetchTickets = async () => {
//     const response = await fetch("/api/tickets");  // TODO: replace with actual API endpoint
//     const data = await response.json();
//     setTickets(data);
//   };

//   fetchTickets();
// }, []);

const ticketList: Ticket[] = [
  {
    id: "001",
    title: "Issue with course registration",
    requester: "Alice Johnson",
    responsible: "Dr. Smith",
    modified: "2024-01-15",
    modifiedBy: "Advisor Team",
  }
];

export default function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="bg-white relative size-full min-h-screen px-30 py-30" data-name="Advisors view">
        <Navigate user={temp_user} newticket={true} />
        <EditForm />       
        {/* <TicketSection title="closed" tickets={[]} /> */}
      </div>
    // </div>
  );
}
