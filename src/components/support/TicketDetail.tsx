import React, { useState } from 'react';
import { Ticket, TicketMessage, TicketStatus } from '@/types/ticket';
import TicketStatusBadge from './TicketStatusBadge';
import { Send, User, Shield, MessageSquare, ArrowLeft, Paperclip, Download } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket | null;
  onSendMessage: (ticketId: string, message: string) => void;
  isAdmin?: boolean;
  onBack?: () => void;
  onStatusChange?: (status: TicketStatus) => void;
}

export default function TicketDetail({ ticket, onSendMessage, isAdmin, onBack, onStatusChange }: TicketDetailProps) {
  const [reply, setReply] = useState('');

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] text-slate-400 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-8">
        <MessageSquare className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Select a Ticket</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a ticket from the list to view details and message support.</p>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim()) {
      onSendMessage(ticket.id, reply);
      setReply('');
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) + ', ' + d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden mt-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Back to list"
              title="Back to list"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{ticket.subject}</h2>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Ticket #{ticket.id}</span>
              <span>•</span>
              <span>Created {formatDate(ticket.createdAt)}</span>
              <span>•</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
                {ticket.category}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right action / info */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {isAdmin && onStatusChange && (
            <div className="flex items-center gap-2">
              <label htmlFor="ticket-status" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:inline">Status:</label>
              <select
                id="ticket-status"
                title="Change ticket status"
                aria-label="Change ticket status"
                value={ticket.status}
                onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
                className="p-1.5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold cursor-pointer shadow-sm transition-colors"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
          
          <div className="text-right pl-3 border-l border-slate-200 dark:border-white/10 hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white">{ticket.clientName}</p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">ID: {ticket.clientId}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-50/20 dark:bg-transparent">
        {ticket.messages.map((msg: TicketMessage) => {
          const isMe = (isAdmin && msg.senderRole === 'admin') || (!isAdmin && msg.senderRole === 'client');
          
          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.senderRole === 'admin' 
                  ? 'bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {msg.senderRole === 'admin' ? <Shield size={15} /> : <User size={15} />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                  <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  isMe 
                    ? 'bg-pink-700 dark:bg-pink-800 text-white rounded-tr-sm shadow-md shadow-pink-500/5' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-white/5 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Attachment rendering */}
                  {msg.attachment && (
                    <div className={`mt-3 p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                      isMe 
                        ? 'bg-pink-800/40 border-pink-600/30 text-pink-100' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip size={14} className="shrink-0 opacity-70" />
                        <span className="truncate font-medium">{msg.attachment.name}</span>
                      </div>
                      <a
                        href={msg.attachment.url}
                        download
                        className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                          isMe ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        title="Download file"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Box */}
      {ticket.status !== 'Closed' && (
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#111118] border-t border-slate-200 dark:border-white/10 shrink-0">
          <form onSubmit={handleSend} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                id="reply-message"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your message here..."
                title="Type your message"
                aria-label="Type your message"
                className="w-full min-h-[50px] max-h-[100px] py-2.5 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:focus:border-pink-500 outline-none resize-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!reply.trim()}
              className="bg-pink-700 hover:bg-pink-800 active:bg-pink-900 dark:bg-pink-700 dark:hover:bg-pink-800 text-white p-3 rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center"
              title="Send message"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
        </div>
      )}
      
      {ticket.status === 'Closed' && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          This ticket has been closed. Re-open the ticket or raise a new one to continue conversation.
        </div>
      )}
    </div>
  );
}
