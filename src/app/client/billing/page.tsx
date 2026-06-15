'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  ArrowUpCircle, 
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import { toast } from 'react-toastify';

interface InvoiceRecord {
  id: string;
  amount: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  billingDate: string;
  dueDate: string;
  pdfUrl: string;
}

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-1091',
    amount: '₹24,999',
    status: 'PAID',
    billingDate: '2026-05-04T10:00:00.000Z',
    dueDate: '2026-05-04T10:00:00.000Z',
    pdfUrl: '#'
  },
  {
    id: 'INV-1092',
    amount: '₹24,999',
    status: 'PAID',
    billingDate: '2026-06-04T10:00:00.000Z',
    dueDate: '2026-06-04T10:00:00.000Z',
    pdfUrl: '#'
  }
];

export default function ClientBillingPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const activePlan = {
    name: 'Growth Accelerator Pro',
    price: '₹24,999',
    cycle: 'Monthly',
    renewsOn: '2026-07-04T10:00:00.000Z',
    status: 'ACTIVE'
  };

  const handleUpgradeSelect = (planName: string) => {
    toast.success(`Package upgrade requested for: ${planName}. Our billing manager will contact you in 1 hour.`);
    setUpgradeModal(false);
  };

  const handleConfirmCancel = () => {
    toast.info('Subscription cancellation request submitted. Access remains active until next cycle.');
    setCancelModal(false);
  };

  const columns: TableColumn<InvoiceRecord>[] = [
    {
      header: 'Invoice ID',
      accessor: 'id',
      align: 'center' as const,
    },
    {
      header: 'Billed Amount',
      accessor: (item) => <span className="font-bold text-slate-800 dark:text-slate-200">{item.amount}</span>,
      align: 'center' as const,
    },
    {
      header: 'Billed Date',
      accessor: (item) => {
        try {
          return format(new Date(item.billingDate), 'dd MMM yyyy');
        } catch {
          return item.billingDate;
        }
      },
      align: 'center' as const,
    },
    {
      header: 'Status',
      accessor: (item) => {
        const styles: Record<string, string> = {
          PAID: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          PENDING: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          FAILED: 'bg-red-100/80 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/30'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[item.status]}`}>
            {item.status.toLowerCase()}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Receipt PDF',
      accessor: (item) => (
        <button
          onClick={() => toast.success(`Downloading Invoice receipt ${item.id}...`)}
          className="inline-flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold px-2.5 py-1.5 rounded-lg hover:bg-pink-50/60 dark:hover:bg-pink-900/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download size={13} />
          Receipt PDF
        </button>
      ),
      align: 'center' as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Billing & Payments</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage invoices, cycles, upgrade subscription packages, or update payments methods</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* Active plan billing overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan stats card */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-pink-500" size={18} />
                  <h4 className="text-sm font-bold">Active package subscription</h4>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1 uppercase tracking-wide">
                  <ShieldCheck size={11} />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Billed Plan</p>
                  <p className="text-xs font-bold mt-1 text-pink-600 dark:text-pink-400">{activePlan.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Pricing Amount</p>
                  <p className="text-xs font-bold mt-1">{activePlan.price} / mo</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Billing Frequency</p>
                  <p className="text-xs font-bold mt-1">{activePlan.cycle}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Renewal Date</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    {format(new Date(activePlan.renewsOn), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setCancelModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:text-white border border-red-200 dark:border-red-950/40 hover:bg-red-600 rounded-xl transition-all cursor-pointer"
              >
                Cancel Subscription
              </button>
              <button
                onClick={() => setUpgradeModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-xs font-bold bg-pink-700 hover:bg-pink-800 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <ArrowUpCircle size={14} />
                Upgrade package
              </button>
            </div>
          </div>

          {/* Secure payment checkout details */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-pink-500" size={18} />
                <h4 className="text-sm font-bold">Secure checkout gates</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your payment cards and transactions are managed securely by Razorpay. All renewals are automated. We do not store card pin values or sensitive CVV keys on our local agency servers.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs mt-4">
              <span className="text-slate-400">Payment Processor</span>
              <span className="font-bold flex items-center gap-1">
                Razorpay Checkout v3
              </span>
            </div>
          </div>
        </div>

        {/* Invoice receipts log feed */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Receipt size={16} className="text-pink-500" />
            Invoice Payment History logs
          </h3>

          <ReusableTable
            data={invoices}
            columns={columns}
            keyExtractor={(item) => item.id}
            loading={false}
          />
        </div>
      </div>

      {/* Upgrade package modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setUpgradeModal(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="text-pink-500" size={18} />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Upgrade Active package</h4>
              </div>
              <button 
                onClick={() => setUpgradeModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Select the package tier you want to scale up to:</p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleUpgradeSelect('Growth Accelerator Enterprise (₹49,999/mo)')}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-pink-500 dark:hover:border-pink-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h5 className="text-xs font-extrabold text-pink-600 dark:text-pink-400">Growth Accelerator Enterprise</h5>
                    <p className="text-[10px] text-slate-400 mt-1">10 Web Pages, 8 Social posts, 1000 Leads generated</p>
                  </div>
                  <span className="text-xs font-black shrink-0">₹49,999</span>
                </button>

                <button
                  onClick={() => handleUpgradeSelect('Custom Enterprise Scaling (Custom Scope)')}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-pink-500 dark:hover:border-pink-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h5 className="text-xs font-extrabold">Custom Enterprise Tier</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Custom deliverables scope, dedicated account manager</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Custom</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel subscription modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setCancelModal(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={18} />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Cancel package subscription</h4>
              </div>
              <button 
                onClick={() => setCancelModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-center">
              <AlertTriangle className="text-red-500 mx-auto" size={36} />
              <div className="space-y-1">
                <h5 className="text-sm font-bold">Are you sure you want to cancel?</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Your website will go offline, ad campaigns will pause, and social postings will stop immediately on next billing renewal.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
