'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  Trash2, 
  RefreshCw, 
  X, 
  CheckCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';
import { useResources } from '@/hooks/useResources';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  adminNote?: string;
  createdAt: string;
}

interface InquiryFilters {
  search: string;
  status: string;
  dateRange: [string, string];
}

export default function InquiriesAdminPage() {
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [modalStatus, setModalStatus] = useState<'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED'>('NEW');
  const [modalNote, setModalNote] = useState('');

  // Initialize unified useResources hook
  const {
    isLoading,
    isSaving,
    isDeleting,
    tableData,
    formData,
    pagination,
    setIsEditing,
    handleInputChange,
    handleDateChange,
    handleClear,
    handleRemove,
    handleSubmit,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    refresh,
  } = useResources<InquiryFilters, ContactSubmission>(
    'contacts',
    {
      search: '',
      status: '',
      dateRange: ['', ''] as [string, string],
    }
  );

  // Open inquiry details modal
  const openDetailsModal = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setModalStatus(contact.status);
    setModalNote(contact.adminNote || '');
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedContact(null);
  };

  // Save changes via handleSubmit
  const handleSaveChanges = async () => {
    if (!selectedContact) return;
    setIsEditing(selectedContact.id);
    await handleSubmit({
      status: modalStatus,
      adminNote: modalNote,
    });
    closeDetailsModal();
  };

  // Delete inquiry via handleRemove
  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    if (!window.confirm(`Are you sure you want to delete this contact submission from ${selectedContact.name}?`)) {
      return;
    }
    await handleRemove(selectedContact.id);
    closeDetailsModal();
  };

  // Action: Search filters submit to backend API
  const handleSearchSubmit = () => {
    const params: Record<string, any> = {};
    if (formData.search) params.search = formData.search;
    if (formData.status) params.status = formData.status;
    
    if (formData.dateRange && formData.dateRange[0]) {
      const start = new Date(formData.dateRange[0]);
      start.setHours(0, 0, 0, 0);
      params.fromDate = start.toISOString();
    }
    
    if (formData.dateRange && formData.dateRange[1]) {
      const end = new Date(formData.dateRange[1]);
      end.setHours(23, 59, 59, 999);
      params.toDate = end.toISOString();
    }

    // Trigger API search
    handleSearch(params);
  };

  // Action: Clear all filters
  const handleResetFilters = () => {
    handleClear();
    handleSearch({});
  };

  // Define input fields for InputWithButtons filter panel
  const filterFields: Field[] = [
    {
      type: 'text',
      name: 'search',
      label: 'Search Query',
      placeholder: 'Search name, email, message...',
      value: formData.search,
      onChange: handleInputChange,
    },
    {
      type: 'dropdown',
      name: 'status',
      label: 'Filter by Status',
      placeholder: 'All Statuses',
      value: formData.status,
      onChange: handleInputChange,
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'NEW', label: 'New' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'ARCHIVED', label: 'Archived' },
      ],
    },
    {
      type: 'date',
      name: 'dateRange',
      label: 'Date Range Selection',
      dateRange: formData.dateRange ? [
        formData.dateRange[0] ? new Date(formData.dateRange[0]) : null,
        formData.dateRange[1] ? new Date(formData.dateRange[1]) : null
      ] : [null, null],
      handleDateChange: handleDateChange,
      aligned:true
    },
  ];

  // Define actions for InputWithButtons filter panel
  const filterButtons: ActionButton[] = [
    {
      text: 'Search',
      onClick: handleSearchSubmit,
      variant: 'primary',
      disabled: isLoading,
    },
    {
      text: 'Clear',
      onClick: handleResetFilters,
      variant: 'outline',
      icon: <X size={14} />,
    },
    {
      text: isLoading ? 'Refreshing…' : 'Refresh Feed',
      onClick: refresh,
      variant: 'outline',
      icon: <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />,
      disabled: isLoading,
    },
  ];

  // Define table columns configuration
  const tableColumns: TableColumn<ContactSubmission>[] = [
    {
      header: 'Inquirer Details',
      accessor: (item: ContactSubmission) => (
        <div className="flex flex-col items-start text-left">
          <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{item.email}</span>
        </div>
      ),
      align: 'left' as const,
    },
    {
      header: 'Contact Number',
      accessor: 'phone',
      align: 'center' as const,
    },
    {
      header: 'Subject & Purpose',
      accessor: (item: ContactSubmission) => (
        <div className="flex flex-col items-start text-left max-w-sm">
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{item.subject}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.message}</span>
        </div>
      ),
      align: 'left' as const,
    },
    {
      header: 'Submitted',
      accessor: (item: ContactSubmission) => {
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
      accessor: (item: ContactSubmission) => {
        const badgeClasses: Record<string, string> = {
          NEW: 'bg-indigo-100/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30',
          IN_PROGRESS: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          RESOLVED: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          ARCHIVED: 'bg-slate-100/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30',
        };
        const labels: Record<string, string> = {
          NEW: 'New',
          IN_PROGRESS: 'In Progress',
          RESOLVED: 'Resolved',
          ARCHIVED: 'Archived',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeClasses[item.status] || ''}`}>
            {labels[item.status] || item.status}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Actions',
      accessor: (item: ContactSubmission) => (
        <button
          onClick={() => openDetailsModal(item)}
          className="inline-flex items-center gap-1.5 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold px-3 py-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Eye size={13} />
          Details
        </button>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Website Inquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review and manage queries sent via the Contact Us form</p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <InputWithButtons 
        fields={filterFields} 
        buttons={filterButtons} 
        gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />

      {/* Data Table */}
      <div className="animate-fade-in">
        <ReusableTable
          data={tableData}
          columns={tableColumns}
          keyExtractor={(item) => item.id}
          loading={isLoading}
          pagination={pagination}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          showExport={false} // CSV Export disabled per request
        />
      </div>

      {/* Detail Overlay Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={closeDetailsModal}
          />

          {/* Modal content shell */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Inquiry Details</h4>
                  <p className="text-[10px] text-slate-400">ID: {selectedContact.id}</p>
                </div>
              </div>
              <button 
                onClick={closeDetailsModal}
                aria-label="Close"
                title="Close"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable details wrapper */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Inquirer Bio card */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Submitted Date</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    {(() => {
                      try {
                        return format(new Date(selectedContact.createdAt), 'dd MMM yyyy, hh:mm a');
                      } catch {
                        return selectedContact.createdAt;
                      }
                    })()}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/40 my-1" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Email Address</span>
                  <a 
                    href={`mailto:${selectedContact.email}`} 
                    className="font-bold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Mail size={12} />
                    {selectedContact.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Phone Number</span>
                  <a 
                    href={`tel:${selectedContact.phone}`} 
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone size={12} />
                    {selectedContact.phone}
                  </a>
                </div>
              </div>

              {/* Inquiry Message content */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Subject & Inquiry Message</span>
                <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{selectedContact.subject}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap select-text">{selectedContact.message}</p>
                </div>
              </div>

              {/* Administrative Updates Panel */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
                <h5 className="text-[10px] text-slate-400 uppercase font-semibold">Administrative Actions</h5>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status update dropdown */}
                  <div>
                    <label htmlFor="modal-status-select" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                      Submission Status
                    </label>
                    <select
                      id="modal-status-select"
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as any)}
                      className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    >
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Administrative follow-up notes */}
                <div>
                  <label htmlFor="modal-admin-note" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                    Internal Follow-Up Notes
                  </label>
                  <textarea
                    id="modal-admin-note"
                    rows={3}
                    placeholder="Enter details of correspondence, e.g. 'Emailed catalog pack, scheduling callback...'"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
              {/* Delete trigger */}
              <button
                type="button"
                onClick={handleDeleteContact}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white border border-red-200 dark:border-red-950/40 hover:bg-red-600 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={13} />
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>

              {/* Persist / Close triggers */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  <CheckCircle size={13} />
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}