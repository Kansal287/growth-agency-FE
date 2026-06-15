'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  RefreshCw, 
  Target,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';
import { toast } from 'react-toastify';

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  createdAt: string;
}

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'LD-401',
    name: 'Aarav Gupta',
    email: 'aarav.g@example.com',
    phone: '+91 98765 43210',
    source: 'Meta Ads - Free Consultation',
    createdAt: '2026-06-12T14:32:00.000Z'
  },
  {
    id: 'LD-402',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+1 415 555 9812',
    source: 'Google Ads - Landing Page',
    createdAt: '2026-06-11T09:15:00.000Z'
  },
  {
    id: 'LD-403',
    name: 'Rajesh Patel',
    email: 'rajesh.p@example.com',
    phone: '+91 91234 56789',
    source: 'Meta Ads - Free Consultation',
    createdAt: '2026-06-11T08:00:00.000Z'
  },
  {
    id: 'LD-404',
    name: 'Neha Roy',
    email: 'neha.roy@example.com',
    phone: '+91 99000 11223',
    source: 'Google Ads - Landing Page',
    createdAt: '2026-06-10T16:45:00.000Z'
  },
  {
    id: 'LD-405',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1 312 555 0192',
    source: 'Organic Website Contact',
    createdAt: '2026-06-08T11:10:00.000Z'
  }
];

export default function ClientLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Client side filtering for visual mock experience
  const filteredLeads = useMemo(() => {
    return leads.filter(item => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchPhone = item.phone.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      if (selectedSource && item.source !== selectedSource) {
        return false;
      }
      return true;
    });
  }, [leads, searchQuery, selectedSource]);

  const paginatedLeads = useMemo(() => {
    const start = currentPage * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    // Basic CSV download formatting
    const headers = 'Lead ID,Name,Email,Phone,Source,Capture Date\n';
    const rows = filteredLeads.map(l => 
      `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.source}","${format(new Date(l.createdAt), 'dd MMM yyyy')}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${format(new Date(), 'dd_MMM')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads list downloaded successfully.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSource('');
    setCurrentPage(0);
  };

  const filterFields: Field[] = [
    {
      type: 'text',
      name: 'search',
      label: 'Search Leads',
      placeholder: 'Search name, email, phone...',
      value: searchQuery,
      onChange: (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
      }
    },
    {
      type: 'dropdown',
      name: 'source',
      label: 'Campaign Source',
      placeholder: 'All Sources',
      value: selectedSource,
      onChange: (e) => {
        setSelectedSource(e.target.value);
        setCurrentPage(0);
      },
      options: [
        { value: '', label: 'All Sources' },
        { value: 'Meta Ads - Free Consultation', label: 'Meta Ads' },
        { value: 'Google Ads - Landing Page', label: 'Google Ads' },
        { value: 'Organic Website Contact', label: 'Organic Site' }
      ]
    }
  ];

  const filterButtons: ActionButton[] = [
    {
      text: 'Reset',
      onClick: handleResetFilters,
      variant: 'outline',
      icon: <XCircleIcon />
    }
  ];

  function XCircleIcon() {
    return <Clock size={14} className="text-slate-400" />;
  }

  const columns: TableColumn<LeadRecord>[] = [
    {
      header: 'Lead ID',
      accessor: 'id',
      align: 'center' as const,
    },
    {
      header: 'Lead Name',
      accessor: (item) => <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>,
      align: 'left' as const,
    },
    {
      header: 'Email Address',
      accessor: (item) => (
        <a href={`mailto:${item.email}`} className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1.5 text-xs font-semibold">
          <Mail size={12} />
          {item.email}
        </a>
      ),
      align: 'left' as const,
    },
    {
      header: 'Phone Number',
      accessor: (item) => (
        <a href={`tel:${item.phone}`} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 text-xs font-semibold">
          <Phone size={12} />
          {item.phone}
        </a>
      ),
      align: 'left' as const,
    },
    {
      header: 'Campaign Source',
      accessor: (item) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {item.source}
        </span>
      ),
      align: 'left' as const,
    },
    {
      header: 'Captured Date',
      accessor: (item) => {
        try {
          return format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a');
        } catch {
          return item.createdAt;
        }
      },
      align: 'center' as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Lead Generation Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitor lead capture statistics, ad performance metrics, and retrieve contact sheets</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* KPI Performance widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Leads Generated</p>
              <p className="text-lg font-black mt-0.5">{leads.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Ad Spend</p>
              <p className="text-lg font-black mt-0.5">₹45,500</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Cost Per Lead (CPL)</p>
              <p className="text-lg font-black mt-0.5">₹94.40</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Campaign Status</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Optimizing
              </p>
            </div>
          </div>
        </div>

        {/* Input search panel toolbar */}
        <InputWithButtons 
          fields={filterFields} 
          buttons={filterButtons} 
          gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        />

        {/* ReusableTable lead directory listing */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <div className="flex sm:items-center justify-between gap-4 flex-wrap">
            <h3 className="text-sm font-bold">Leads Database Directory</h3>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Download size={14} />
              Export Contacts CSV
            </button>
          </div>

          <ReusableTable
            data={paginatedLeads}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
            pagination={{
              page: currentPage,
              rowsPerPage,
              totalItems: filteredLeads.length
            }}
            onChangePage={(_, p) => setCurrentPage(p)}
            onChangeRowsPerPage={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
