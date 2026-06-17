"use client";

import React, { useState } from 'react';
import { mockTickets, Ticket, TicketMessage } from '@/types/ticket';
import TicketList from '@/components/support/TicketList';
import TicketDetail from '@/components/support/TicketDetail';
import CreateTicketDialog from '@/components/support/CreateTicketDialog';
import WhatsAppButton from '@/components/support/WhatsAppButton';
import { Plus } from 'lucide-react';

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(
    mockTickets.filter(t => t.clientId === "USR-101")
  );
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  const handleSendMessage = (ticketId: string, content: string) => {
    const newMessage: TicketMessage = {
      id: `MSG-${Date.now()}`,
      senderId: "USR-101",
      senderName: "Rahul Sharma",
      senderRole: "client",
      content,
      timestamp: new Date().toISOString(),
    };

    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            updatedAt: new Date().toISOString(),
            messages: [...ticket.messages, newMessage]
          };
        }
        return ticket;
      })
    );
  };

  const handleCreateTicket = (subject: string, category: string, description: string, attachment: File | null) => {
    const attachmentData = attachment ? {
      name: attachment.name,
      url: '#',
      type: attachment.type
    } : undefined;

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      clientId: "USR-101",
      clientName: "Rahul Sharma",
      subject,
      category,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `MSG-${Date.now()}`,
          senderId: "USR-101",
          senderName: "Rahul Sharma",
          senderRole: "client",
          content: description,
          timestamp: new Date().toISOString(),
          attachment: attachmentData
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Support & Helpdesk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Submit support queries, track resolution states, and talk on WhatsApp</p>
        </div>
        
        {/* Only show raise ticket button on top if list is visible on mobile or we are on desktop */}
        {(!selectedTicketId || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white shadow-sm self-start sm:self-center"
          >
            <Plus size={16} />
            <span>Raise Ticket</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Ticket List Column */}
        <div className={`${selectedTicketId ? 'hidden md:block' : 'block'} md:col-span-4 lg:col-span-3`}>
          <TicketList 
            tickets={tickets} 
            selectedTicketId={selectedTicketId} 
            onSelectTicket={setSelectedTicketId} 
          />
        </div>
        
        {/* Ticket Detail Column */}
        <div className={`${!selectedTicketId ? 'hidden md:block' : 'block'} md:col-span-8 lg:col-span-9`}>
          <TicketDetail 
            ticket={selectedTicket} 
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedTicketId(null)}
          />
        </div>
      </div>

      <CreateTicketDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateTicket} 
      />
      
      <WhatsAppButton />
    </div>
  );
}
