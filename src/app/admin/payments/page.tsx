'use client';

import React from 'react';
import { RefreshCw, X, CreditCard, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { useResources } from '@/hooks/useResources';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';

interface UserInfo {
  name?: string;
  email?: string;
}

interface PlanInfo {
  name?: string;
}

interface PaymentRecord {
  id: string;
  _id?: string;
  paymentId?: string;
  razorpayPaymentId?: string;
  userId?: string;
  user?: UserInfo;
  userName?: string;
  userEmail?: string;
  planId?: string;
  plan?: PlanInfo;
  packageName?: string;
  amount: number; // in paise
  currency?: string;
  status: 'PAID' | 'FAILED' | 'PENDING';
  createdAt: string;
}

interface PaymentFilters {
  status: string;
}

export default function PaymentsAdminPage() {
  const initialFilterState: PaymentFilters = {
    status: '',
  };

  const {
    isLoading,
    tableData,
    formData,
    pagination,
    handleInputChange,
    handleClear,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    refresh,
  } = useResources<PaymentFilters, PaymentRecord>('payments', initialFilterState);

  // Trigger search filter
  const handleFilterSubmit = () => {
    const params: Record<string, any> = {};
    if (formData.status) {
      params.status = formData.status;
    }
    handleSearch(params);
  };

  // Reset filter
  const handleResetFilters = () => {
    handleClear();
    handleSearch({});
  };

  // Define input fields for filters panel
  const filterFields: Field[] = [
    {
      type: 'dropdown',
      name: 'status',
      label: 'Payment Status',
      placeholder: 'All Statuses',
      value: formData.status,
      onChange: handleInputChange,
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'PAID', label: 'Paid' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'PENDING', label: 'Pending' },
      ],
    },
  ];

  // Define action buttons for filters panel
  const filterButtons: ActionButton[] = [
    {
      text: 'Apply Filters',
      onClick: handleFilterSubmit,
      variant: 'primary',
      disabled: isLoading,
    },
    {
      text: 'Reset',
      onClick: handleResetFilters,
      variant: 'outline',
      icon: <X size={14} />,
    },
    {
      text: isLoading ? 'Syncing…' : 'Sync History',
      onClick: refresh,
      variant: 'outline',
      icon: <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />,
      disabled: isLoading,
    },
  ];

  // Define table columns configuration
  const tableColumns: TableColumn<PaymentRecord>[] = [
    {
      header: 'Payment / Invoice ID',
      accessor: (item: PaymentRecord) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {item.razorpayPaymentId || item.paymentId || item.id || item._id}
        </span>
      ),
      align: 'left' as const,
    },
    {
      header: 'Customer Details',
      accessor: (item: PaymentRecord) => {
        const name = item.user?.name || item.userName || 'Guest User';
        const email = item.user?.email || item.userEmail || 'no-email@example.com';
        return (
          <div className="flex flex-col items-start text-left">
            <span className="font-bold text-slate-900 dark:text-slate-100">{name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{email}</span>
          </div>
        );
      },
      align: 'left' as const,
    },
    {
      header: 'Subscription Plan',
      accessor: (item: PaymentRecord) => {
        const planName = item.plan?.name || item.packageName || item.planId || 'Standard Plan';
        return (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {planName}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Amount Paid',
      accessor: (item: PaymentRecord) => {
        const amt = item.amount / 100; // paise to Rupees
        return (
          <span className="font-bold flex items-center justify-center gap-0.5 text-slate-900 dark:text-slate-100">
            <IndianRupee size={12} className="text-slate-400" />
            {amt.toLocaleString('en-IN')}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Transaction Date',
      accessor: (item: PaymentRecord) => {
        try {
          return (
            <span className="text-xs text-slate-600 dark:text-slate-400 inline-flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              {format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a')}
            </span>
          );
        } catch {
          return <span className="text-xs">{item.createdAt}</span>;
        }
      },
      align: 'center' as const,
    },
    {
      header: 'Status',
      accessor: (item: PaymentRecord) => {
        const badgeClasses: Record<string, string> = {
          PAID: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          FAILED: 'bg-rose-100/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/30',
          PENDING: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
        };
        const labels: Record<string, string> = {
          PAID: 'Paid',
          FAILED: 'Failed',
          PENDING: 'Pending',
        };
        const currentStatus = item.status || 'PENDING';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeClasses[currentStatus] || ''}`}>
            {labels[currentStatus] || currentStatus}
          </span>
        );
      },
      align: 'center' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Payments & Invoices</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track billing events, checkout transactions, and failed payment flags</p>
        </div>
      </div>

      {/* Filters and Search Panel */}
      <InputWithButtons
        fields={filterFields}
        buttons={filterButtons}
        gridClass="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      />

      {/* Data Table */}
      <div className="animate-fade-in">
        <ReusableTable
          data={tableData}
          columns={tableColumns}
          keyExtractor={(item) => item.id || item._id}
          loading={isLoading}
          pagination={pagination}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          showExport={false}
        />
      </div>
    </div>
  );
}
