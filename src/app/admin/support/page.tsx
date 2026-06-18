"use client";

import React, { useState } from 'react';
import { mockTickets, Ticket, TicketMessage, TicketStatus } from '@/types/ticket';
import TicketList from '@/components/support/TicketList';
import TicketDetail from '@/components/support/TicketDetail';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'>('All');

  const handleSendMessage = (ticketId: string, content: string) => {
    const newMessage: TicketMessage = {
      id: `MSG-${Date.now()}`,
      senderId: "ADM-001",
      senderName: "Support Team",
      senderRole: "admin",
      content,
      timestamp: new Date().toISOString(),
    };

    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            updatedAt: new Date().toISOString(),
            status: ticket.status === 'Open' ? 'In Progress' : ticket.status, // Auto update status to In Progress
            messages: [...ticket.messages, newMessage]
          };
        }
        return ticket;
      })
    );
  };

  const handleStatusChange = (status: TicketStatus) => {
    if (!selectedTicketId) return;
    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === selectedTicketId) {
          return {
            ...ticket,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
  };

  const filteredTickets = tickets.filter(t => filter === 'All' ? true : t.status === filter);
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Support Tickets Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage user inquiries, reply to issues, and modify ticket statuses</p>
        </div>
        
        {/* Filters Panel */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label 
            htmlFor="ticket-filter"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Filter:
          </label>
          <select 
            id="ticket-filter"
            title="Filter tickets by status"
            aria-label="Filter tickets by status"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setSelectedTicketId(null); // Clear selection when filter changes to avoid mismatch
            }}
            className="p-2 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <option value="All">All Tickets</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Ticket List Column */}
        <div className={`${selectedTicketId ? 'hidden md:block' : 'block'} md:col-span-4 lg:col-span-3`}>
          <TicketList 
            tickets={filteredTickets} 
            selectedTicketId={selectedTicketId} 
            onSelectTicket={setSelectedTicketId} 
            isAdmin={true}
          />
        </div>
        
        {/* Ticket Detail Column */}
        <div className={`${!selectedTicketId ? 'hidden md:block' : 'block'} md:col-span-8 lg:col-span-9`}>
          <TicketDetail 
            ticket={selectedTicket} 
            onSendMessage={handleSendMessage} 
            isAdmin={true}
            onBack={() => setSelectedTicketId(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
