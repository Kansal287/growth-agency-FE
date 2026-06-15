'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Server, 
  Info,
  Clock,
  X,
  FileText
} from 'lucide-react';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface RevisionRequest {
  id: string;
  section: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

const INITIAL_REVISIONS: RevisionRequest[] = [
  {
    id: 'REV-001',
    section: 'Homepage Hero',
    description: 'Change the primary header font weight and increase spacing in hero content.',
    status: 'COMPLETED',
    createdAt: '2026-06-10T11:20:00.000Z'
  },
  {
    id: 'REV-002',
    section: 'Contact Form',
    description: 'Add placeholder examples inside email inputs and correct the spacing.',
    status: 'IN_PROGRESS',
    createdAt: '2026-06-12T08:45:00.000Z'
  },
  {
    id: 'REV-003',
    section: 'Pricing Section',
    description: 'Update price text colors to use corporate dark accent and align checkmarks.',
    status: 'PENDING',
    createdAt: '2026-06-13T09:00:00.000Z'
  }
];

export default function ClientWebsitePage() {
  const [revisions, setRevisions] = useState<RevisionRequest[]>(INITIAL_REVISIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSection, setFormSection] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const [currentStage] = useState<'MOCKUP' | 'DEV' | 'QA' | 'LIVE'>('DEV');

  // DNS Mapping demo details
  const dnsDetails = [
    { type: 'A', name: '@', value: '76.76.21.21', status: 'Connected' },
    { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', status: 'Verifying DNS...' }
  ];

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSection.trim() || !formDescription.trim()) {
      toast.error('Please input revision section and description.');
      return;
    }

    const newRev: RevisionRequest = {
      id: `REV-00${revisions.length + 1}`,
      section: formSection,
      description: formDescription,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setRevisions([newRev, ...revisions]);
    setFormSection('');
    setFormDescription('');
    setModalOpen(false);
    toast.success('Website revision request logged successfully.');
  };

  const columns: TableColumn<RevisionRequest>[] = [
    {
      header: 'Revision ID',
      accessor: 'id',
      align: 'center' as const,
    },
    {
      header: 'Scope Section',
      accessor: (item) => <span className="font-bold text-slate-800 dark:text-slate-200">{item.section}</span>,
      align: 'left' as const,
    },
    {
      header: 'Change Description',
      accessor: (item) => <p className="max-w-md line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{item.description}</p>,
      align: 'left' as const,
    },
    {
      header: 'Submitted At',
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
      header: 'Status',
      accessor: (item) => {
        const styles: Record<string, string> = {
          PENDING: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          IN_PROGRESS: 'bg-indigo-100/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30',
          COMPLETED: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[item.status]}`}>
            {item.status === 'IN_PROGRESS' ? 'In Progress' : item.status.toLowerCase()}
          </span>
        );
      },
      align: 'center' as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Website deliverables</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track build stages, inspect live previews, and log revision requests</p>
        </div>

        <a 
          href="https://staging.growthimmortals.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <ExternalLink size={14} />
          Launch Staging Preview
        </a>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        {/* Milestone Steps progression */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118]">
          <h3 className="text-sm font-bold mb-4">Website Development Pipeline</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${currentStage !== 'MOCKUP' ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-500/5' : 'border-pink-500 bg-pink-500/5'}`}>
              <CheckCircle2 className={currentStage !== 'MOCKUP' ? 'text-emerald-500' : 'text-pink-500'} size={20} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Stage 1</p>
                <p className="text-xs font-bold">Mockups Sign-Off</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 border-pink-500 bg-pink-500/5`}>
              <Clock className="text-pink-500 animate-pulse" size={20} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Stage 2</p>
                <p className="text-xs font-bold">Live Development</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 border-gray-200 dark:border-white/5 opacity-60`}>
              <Info className="text-slate-400" size={20} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Stage 3</p>
                <p className="text-xs font-bold">Client Review / QA</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 border-gray-200 dark:border-white/5 opacity-60`}>
              <Globe className="text-slate-400" size={20} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Stage 4</p>
                <p className="text-xs font-bold">Launch & Live Setup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Server & Domain status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Setup */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="text-pink-500" size={18} />
              <h4 className="text-sm font-bold">Custom Domain Mapping</h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-gray-100 dark:border-white/5 pb-2">
                <span className="text-slate-400">Configured Domain</span>
                <span className="font-bold">www.yourbrand.com</span>
              </div>

              {/* DNS parameters list */}
              <div className="text-xs space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">DNS Configuration values</p>
                {dnsDetails.map((dns, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-white/2 rounded-xl flex items-center justify-between border border-gray-100 dark:border-white/5 font-mono text-[11px]">
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded mr-2 text-slate-700 dark:text-slate-300">{dns.type}</span>
                      <span>{dns.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span>{dns.value}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${dns.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        {dns.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hosting Credentials status */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="text-pink-500" size={18} />
                <h4 className="text-sm font-bold">Hosting & Server status</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your portal site is hosted on our premium Vercel agency clusters, ensuring 99.9% uptime, global CDN replication, and integrated SSL certificates automatically mapping new DNS edits.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs mt-4">
              <span className="text-slate-400 font-medium">SSL Security Certificate</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Active & Secured (Let's Encrypt)
              </span>
            </div>
          </div>
        </div>

        {/* Revisions requests section */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <div className="flex sm:items-center justify-between gap-4 flex-wrap">
            <h3 className="text-sm font-bold">Revision & Feedback Requests</h3>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Submit Revision
            </button>
          </div>

          <ReusableTable
            data={revisions}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
          />
        </div>
      </div>

      {/* Submit Revision Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Container */}
          <form 
            onSubmit={handleAddRevision}
            className="relative w-full max-w-md bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">New Revision Request</h4>
              </div>
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="rev-section" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                  Page Section / Scope <span className="text-red-500">*</span>
                </label>
                <input
                  id="rev-section"
                  type="text"
                  required
                  placeholder="e.g. Header pricing section, mobile menu links..."
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label htmlFor="rev-desc" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                  Detail Description of Changes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rev-desc"
                  required
                  rows={4}
                  placeholder="e.g. The green in pricing checks is slightly too bright. Please use #22c55e instead, or adjust spacing between elements..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white rounded-xl shadow-md transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
