import React from 'react';
import { Ticket } from '@/types/ticket';
import TicketStatusBadge from './TicketStatusBadge';
import { MessageSquare, Calendar } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
  isAdmin?: boolean;
}

export default function TicketList({ tickets, selectedTicketId, onSelectTicket, isAdmin }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
          <MessageSquare size={20} />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tickets found</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">There are no support tickets in this view.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
      {tickets.map((ticket) => {
        const isSelected = selectedTicketId === ticket.id;
        return (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-pink-50/50 dark:bg-pink-950/10 border-pink-200 dark:border-pink-900/30 ring-1 ring-pink-500/10'
                : 'bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 flex-1">
                {ticket.subject}
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(ticket.updatedAt)}
              </span>
            </div>
            
            <div className="flex justify-between items-end mt-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">#{ticket.id}</span>
                {isAdmin && (
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[120px]">
                    {ticket.clientName}
                  </span>
                )}
              </div>
              <TicketStatusBadge status={ticket.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
