import React from 'react';
import { TicketStatus } from '@/types/ticket';

export default function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50';
      case 'In Progress':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50';
      case 'Resolved':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50';
      case 'Closed':
        return 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50';
      default:
        return 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${getStatusStyles()}`}>
      {status}
    </span>
  );
}
