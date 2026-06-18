'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, X, CheckCircle, IndianRupee } from 'lucide-react';
import { useResources } from '@/hooks/useResources';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';
import { toast } from 'react-toastify';

interface Plan {
  id?: string;
  _id?: string;
  name: string;
  price: number; // in paise
  currency: string;
  billingCycle: string;
  features: string[];
}

interface PlanForm {
  name: string;
  price: string; // Rupees in text input
  currency: string;
  billingCycle: string;
  featuresText: string; // Newline-separated text
}

export default function PlansAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const initialFormState: PlanForm = {
    name: '',
    price: '',
    currency: 'INR',
    billingCycle: 'MONTHLY',
    featuresText: '',
  };

  const {
    isLoading,
    isSaving,
    isDeleting,
    tableData,
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleClear,
    handleRemove,
    handleSubmit,
    refresh,
  } = useResources<PlanForm, Plan>('plans', initialFormState);

  // Custom Edit trigger to format values for form input
  const handleEditClick = (plan: Plan) => {
    setIsEditing((plan.id || plan._id) ?? null);
    setFormData({
      name: plan.name,
      price: (plan.price / 100).toString(),
      currency: plan.currency || 'INR',
      billingCycle: plan.billingCycle || 'MONTHLY',
      featuresText: plan.features ? plan.features.join('\n') : '',
    });
    setModalOpen(true);
  };

  // Custom Submit trigger to format values for API (Rupees to Paise, split features text)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Plan Name is required');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceInPaise = Math.round(priceNum * 100);
    const featuresArray = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: formData.name.trim(),
      price: priceInPaise,
      currency: formData.currency,
      billingCycle: formData.billingCycle,
      features: featuresArray,
    };

    await handleSubmit(payload);
    setModalOpen(false);
    handleClear();
  };

  const handleCreateNewClick = () => {
    handleClear();
    setIsEditing(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    handleClear();
  };

  const tableColumns: TableColumn<Plan>[] = [
    {
      header: 'Plan Name',
      accessor: 'name',
      align: 'left' as const,
    },
    {
      header: 'Price (Rupees)',
      accessor: (item: Plan) => {
        const amt = item.price / 100;
        return (
          <span className="font-bold flex items-center justify-center gap-0.5">
            <IndianRupee size={12} className="text-slate-400" />
            {amt.toLocaleString('en-IN')}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Billing Cycle',
      accessor: (item: Plan) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30 uppercase">
          {item.billingCycle}
        </span>
      ),
      align: 'center' as const,
    },
    {
      header: 'Features',
      accessor: (item: Plan) => (
        <div className="flex flex-wrap gap-1 justify-center max-w-sm mx-auto">
          {item.features && item.features.length > 0 ? (
            item.features.map((feature, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {feature}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400">No features listed</span>
          )}
        </div>
      ),
      align: 'center' as const,
    },
    {
      header: 'Actions',
      accessor: (item: Plan) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleEditClick(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors cursor-pointer"
            title="Edit Plan"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete plan "${item.name}"?`)) {
                handleRemove((item.id || item._id) as string);
              }
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors cursor-pointer"
            title="Delete Plan"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Subscription Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage pricing tiers, billing cycles, and customer plan features</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-gray-900 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleCreateNewClick}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} />
            Add Plan
          </button>
        </div>
      </div>

      {/* Plans Table View */}
      <div className="animate-fade-in">
        <ReusableTable
          data={tableData}
          columns={tableColumns}
          keyExtractor={(item) => (item.id || item._id) as string}
          loading={isLoading}
          showExport={false}
        />
      </div>

      {/* Plan Create / Edit Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
            <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Plan Features' : 'Create Subscription Plan'}
                </h4>
                <button
                  type="button"
                  aria-label="Close"
                  title="Close"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                
                >
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Plan Name */}
                <div>
                  <label htmlFor="plan-name" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="plan-name"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Starter Presence"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Price and Billing Cycle */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plan-price" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                      Price in Rupees <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                        ₹
                      </span>
                      <input
                        id="plan-price"
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1999"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-7 pr-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="plan-billingCycle" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                      Billing Cycle <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="plan-billingCycle"
                      name="billingCycle"
                      value={formData.billingCycle}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="QUARTERLY">Quarterly</option>
                    </select>
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="plan-currency" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                    Currency
                  </label>
                  <select
                    id="plan-currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                {/* Features list */}
                <div>
                  <label htmlFor="plan-featuresText" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                    Features List (One feature per line)
                  </label>
                  <textarea
                    id="plan-featuresText"
                    name="featuresText"
                    rows={6}
                    placeholder="e.g.&#10;5-page informative website&#10;2 social media posts weekly&#10;Basic SEO Setup"
                    value={formData.featuresText}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  <CheckCircle size={13} />
                  {isSaving ? 'Saving…' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
