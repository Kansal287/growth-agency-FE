'use client';

import React, { useState, useMemo } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import { toast } from 'react-toastify';

interface TicketMessage {
  id: string;
  sender: 'CLIENT' | 'AGENT';
  content: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'WEBSITE' | 'BILLING' | 'SOCIAL_MEDIA' | 'TECHNICAL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  messages: TicketMessage[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-701',
    subject: 'Analytics dashboard loading delay',
    description: 'The Lead generation dashboard is taking about 10 seconds to compile results on mobile. Please check queries caching.',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-06-11T14:32:00.000Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'CLIENT',
        content: 'The Lead generation dashboard is taking about 10 seconds to compile results on mobile. Please check queries caching.',
        timestamp: '2026-06-11T14:32:00.000Z'
      },
      {
        id: 'msg-2',
        sender: 'AGENT',
        content: 'Hi! Thanks for reporting. We found that the DB leads aggregate check was running an uncached count. We are applying a Redis cache layer now. Will update you.',
        timestamp: '2026-06-11T16:00:00.000Z'
      }
    ]
  },
  {
    id: 'TKT-702',
    subject: 'DNS A-record pointing verification',
    description: 'We pointed the A-record to the target IP 76.76.21.21 yesterday but it still shows verifying DNS on our dashboard.',
    category: 'WEBSITE',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-06-13T08:00:00.000Z',
    messages: [
      {
        id: 'msg-3',
        sender: 'CLIENT',
        content: 'We pointed the A-record to the target IP 76.76.21.21 yesterday but it still shows verifying DNS on our dashboard.',
        timestamp: '2026-06-13T08:00:00.000Z'
      }
    ]
  },
  {
    id: 'TKT-703',
    subject: 'Razorpay billing invoice mismatch',
    description: 'The receipt amount reflects the standard price instead of the first-month coupon discount. Please review.',
    category: 'BILLING',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-06-05T09:15:00.000Z',
    messages: [
      {
        id: 'msg-4',
        sender: 'CLIENT',
        content: 'The receipt amount reflects the standard price instead of the first-month coupon discount. Please review.',
        timestamp: '2026-06-05T09:15:00.000Z'
      },
      {
        id: 'msg-5',
        sender: 'AGENT',
        content: 'Apologies for the billing mismatch. We have applied a manual refund of ₹5,000 via the Razorpay dash and updated invoice records.',
        timestamp: '2026-06-05T11:45:00.000Z'
      },
      {
        id: 'msg-6',
        sender: 'CLIENT',
        content: 'Got the refund notification, thank you so much for the quick fix!',
        timestamp: '2026-06-05T12:00:00.000Z'
      }
    ]
  }
];

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Ticket creation Form State
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<SupportTicket['category']>('WEBSITE');
  const [formPriority, setFormPriority] = useState<SupportTicket['priority']>('LOW');
  const [formDescription, setFormDescription] = useState('');

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  // Stats calculation
  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const newTicket: SupportTicket = {
      id: `TKT-70${tickets.length + 1}`,
      subject: formSubject,
      description: formDescription,
      category: formCategory,
      priority: formPriority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-init',
          sender: 'CLIENT',
          content: formDescription,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setFormSubject('');
    setFormDescription('');
    setNewTicketModal(false);
    toast.success('Support ticket raised successfully. A team agent will respond soon.');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'CLIENT',
      content: replyText,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...selectedTicket.messages, newMsg];
    
    // Update local ticket reference
    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      messages: updatedMessages
    };

    // Update tickets list state
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setReplyText('');

    toast.success('Reply submitted.');

    // Simulated Auto-Reply from Agent after 1.5 seconds
    setTimeout(() => {
      const autoReply: TicketMessage = {
        id: `msg-auto-${Date.now()}`,
        sender: 'AGENT',
        content: "Understood. Our developers have received your update and we are testing it on the server branch. We will post a review report here shortly.",
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, autoReply];
      const finalTicket = { ...updatedTicket, messages: finalMessages };

      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? finalTicket : t));
      
      // Update modal view if still looking at the same ticket
      setSelectedTicket(prev => prev && prev.id === selectedTicket.id ? finalTicket : prev);
    }, 1500);
  };

  const handleMarkResolved = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
    setSelectedTicket(prev => prev && prev.id === id ? { ...prev, status: 'RESOLVED' } : prev);
    toast.success('Ticket marked as resolved.');
  };

  const columns: TableColumn<SupportTicket>[] = [
    {
      header: 'Ticket ID',
      accessor: 'id',
      align: 'center' as const,
    },
    {
      header: 'Ticket Subject',
      accessor: (item) => (
        <div className="flex flex-col items-start text-left">
          <span className="font-bold text-slate-800 dark:text-slate-200">{item.subject}</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded mt-1 text-slate-500">
            {item.category}
          </span>
        </div>
      ),
      align: 'left' as const,
    },
    {
      header: 'Priority',
      accessor: (item) => {
        const styles: Record<string, string> = {
          HIGH: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30',
          MEDIUM: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30',
          LOW: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30'
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold ${styles[item.priority]}`}>
            {item.priority}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Status',
      accessor: (item) => {
        const styles: Record<string, string> = {
          OPEN: 'bg-blue-100/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30',
          IN_PROGRESS: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          RESOLVED: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          CLOSED: 'bg-slate-100/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[item.status]}`}>
            {item.status === 'IN_PROGRESS' ? 'in progress' : item.status.toLowerCase()}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Created At',
      accessor: (item) => {
        try {
          return format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a');
        } catch {
          return item.createdAt;
        }
      },
      align: 'center' as const,
    },
    {
      header: 'Action',
      accessor: (item) => (
        <button
          onClick={() => setSelectedTicket(item)}
          className="inline-flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold px-2.5 py-1.5 rounded-lg hover:bg-pink-50/60 dark:hover:bg-pink-900/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <MessageSquare size={13} />
          Chat
        </button>
      ),
      align: 'center' as const,
    }
  ];

  // FAQ mock list
  const faqs = [
    {
      q: 'How fast do you implement website revision requests?',
      a: 'Standard content edits, text changes, or layout spacing requests are resolved within 24-48 hours. Larger design overhauls or API system integrations may take 3-5 business days.'
    },
    {
      q: 'When do social media calendar templates publish?',
      a: 'Once you hit "Approve Post", the creative is locked into our automation schedules and pushes live on the designated platforms at the scheduled time. Rejected posts go back to drafts.'
    },
    {
      q: 'How can I increase our monthly advertising budget?',
      a: 'Open a Billing or General support ticket, or chat directly with our operators via the WhatsApp support option. We can instantly scale ad campaign tiers.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Support Desk Workspace</h2>
          <p className="text-xs text-slate-500 mt-0.5">Submit technical review requests, monitor invoices disputes, or contact account directors</p>
        </div>

        {/* WhatsApp redirection Button */}
        <a 
          href="https://wa.me/919999999999?text=Hello%20Growth%20Immortals%20Support%2C%20I%20need%20help%20with..."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <Send size={13} />
          WhatsApp Support Channel
        </a>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* Support metrics banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <LifeBuoy size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Tickets raised</p>
              <p className="text-lg font-black mt-0.5">{tickets.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Awaiting Operator response</p>
              <p className="text-lg font-black mt-0.5">{openCount}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Resolved issues</p>
              <p className="text-lg font-black mt-0.5">{resolvedCount}</p>
            </div>
          </div>
        </div>

        {/* Tickets Table listing */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <div className="flex sm:items-center justify-between gap-4 flex-wrap pb-2 border-b border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <MessageSquare size={16} className="text-pink-500" />
              Active support requests log
            </h3>
            
            <button
              onClick={() => setNewTicketModal(true)}
              className="inline-flex items-center gap-1 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Raise Ticket
            </button>
          </div>

          <ReusableTable
            data={tickets}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
          />
        </div>

        {/* FAQ Accordion lists */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <HelpCircle size={16} className="text-pink-500" />
            Support FAQ Knowledge Base
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-bold bg-slate-50/50 dark:bg-white/2 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${faqOpen[idx] ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen[idx] && (
                  <div className="p-4 border-t border-gray-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-[#111118] animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raise Ticket modal dialog */}
      {newTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setNewTicketModal(false)}
          />

          <form 
            onSubmit={handleRaiseTicket}
            className="relative w-full max-w-md bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <LifeBuoy size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Raise support ticket</h4>
              </div>
              <button 
                type="button"
                onClick={() => setNewTicketModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="tkt-subject" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                  Ticket Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="tkt-subject"
                  type="text"
                  required
                  placeholder="e.g. Website payment failure, social graphic revisions..."
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tkt-category" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Category</label>
                  <select
                    id="tkt-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                  >
                    <option value="WEBSITE">Website</option>
                    <option value="BILLING">Billing</option>
                    <option value="SOCIAL_MEDIA">Social Media</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tkt-priority" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Priority</label>
                  <select
                    id="tkt-priority"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tkt-desc" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                  Describe the issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="tkt-desc"
                  required
                  rows={4}
                  placeholder="Detail the issue completely, including steps or variables for debugging..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewTicketModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-pink-700 hover:bg-pink-800 text-white rounded-xl shadow-md transition-colors"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Chat thread conversation modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setSelectedTicket(null)}
          />

          {/* Modal layout shell */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100 flex flex-col h-[80vh] max-h-[600px]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[240px]">{selectedTicket.subject}</h4>
                  <p className="text-[10px] text-slate-400">ID: {selectedTicket.id} | Status: {selectedTicket.status}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Thread Messages list */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/10">
              {selectedTicket.messages.map((msg) => {
                const isClient = msg.sender === 'CLIENT';
                return (
                  <div key={msg.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-1 text-[9px] text-slate-400 font-semibold">
                      <span>{isClient ? 'You' : 'Support Agent'}</span>
                      <span>•</span>
                      <span>{format(new Date(msg.timestamp), 'hh:mm a')}</span>
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${isClient ? 'bg-pink-700 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                      <p className="whitespace-pre-wrap select-text">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Reply Form */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 shrink-0">
              {selectedTicket.status !== 'RESOLVED' ? (
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type a follow-up reply message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 bg-pink-700 hover:bg-pink-800 text-white rounded-xl flex items-center justify-center shadow-md transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkResolved(selectedTicket.id)}
                    className="px-3 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                    title="Mark as Resolved"
                  >
                    Resolve
                  </button>
                </form>
              ) : (
                <div className="text-center py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} />
                  This ticket has been resolved.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
