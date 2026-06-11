'use client';

import React, { useState, useEffect } from 'react';
import {
  Eye,
  RefreshCw,
  X,
  User,
  Shield,
  Phone,
  Mail,
  Clock,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Compass,
  FileText,
  Activity,
  UserCheck,
  UserX,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';
import { useResources } from '@/hooks/useResources';
import apiClient from '@/lib/api-client';

interface OnboardingData {
  id: string;
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  useCase?: string;
  teamSize?: string;
  goals?: string;
  industry?: string;
  aboutBusiness?: string;
  brandColors?: string;
  referenceWebsites?: string;
  socialMediaLinks?: string;
  pagesNeeded?: string;
  servicesProducts?: string;
  competitors?: string;
  instagramFacebookAccess?: string;
  existingHandles?: string;
  targetLocation?: string;
  targetAudience?: string;
  budget?: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionData {
  id: string;
  planId: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
  razorpaySubscriptionId?: string;
  planName?: string;
  amount?: number; // in paise
  billingCycle?: string;
  renewalDate?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  role: 'admin' | 'client' | 'public';
  createdAt: string;
  onboarding?: OnboardingData | null;
  subscription?: SubscriptionData | null;
}

interface UserFilters {
  search: string;
  status: string;
}

export default function UsersAdminPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'onboarding' | 'subscription'>('profile');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Initialize unified useResources hook for 'users'
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
  } = useResources<UserFilters, User>(
    'users',
    {
      search: '',
      status: '',
    }
  );

  // Fetch full details when selected user changes
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      return;
    }

    const fetchUserDetails = async () => {
      setDetailsLoading(true);
      try {
        const response = await apiClient.get(`/admin/users/${selectedUserId}`);
        const result = response.data;
        
        // Handle nested payloads wrapper safely
        if (result && result.success) {
          setSelectedUser(result.data || result.user || result);
        } else {
          // Fallback to local list record if api fails to return single object wrapper
          const localRecord = tableData.find(u => u.id === selectedUserId);
          if (localRecord) {
            setSelectedUser(localRecord);
          }
          toast.error(result?.message || 'Failed to retrieve detailed profile');
        }
      } catch (err: any) {
        console.error('Error fetching user details:', err);
        const localRecord = tableData.find(u => u.id === selectedUserId);
        if (localRecord) {
          setSelectedUser(localRecord);
        }
        toast.error(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUserId, tableData]);

  // Open details modal
  const openDetailsModal = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('profile');
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  // Block or Unblock operator action call
  const handleToggleStatus = async (user: User) => {
    if (!user) return;
    const targetStatus = !user.isActive;
    const actionText = targetStatus ? 'unblock' : 'block';

    if (!window.confirm(`Are you sure you want to ${actionText} ${user.name}?`)) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await apiClient.patch(`/admin/users/${user.id}/status`, {
        isActive: targetStatus,
      });

      if (response.status === 200 || response.data?.success) {
        toast.success(`User successfully ${targetStatus ? 'unblocked' : 'blocked'}.`);
        
        // Sync local selected state
        if (selectedUser && selectedUser.id === user.id) {
          setSelectedUser(prev => prev ? { ...prev, isActive: targetStatus } : null);
        }
        
        // Refresh feed list
        refresh();
      } else {
        toast.error(response.data?.message || `Failed to ${actionText} user`);
      }
    } catch (err: any) {
      console.error(`Error trying to toggle user active status:`, err);
      toast.error(err.response?.data?.message || `Failed to toggle user status`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Search Submit Action
  const handleSearchSubmit = () => {
    const params: Record<string, any> = {};
    if (formData.search) params.search = formData.search;
    if (formData.status) {
      // Maps value back to backend params if needed
      params.isActive = formData.status === 'ACTIVE' ? 'true' : 'false';
    }
    handleSearch(params);
  };

  // Handle Clear Filter Action
  const handleResetFilters = () => {
    handleClear();
    handleSearch({});
  };

  // Utility to safely convert timestamps to human-readable text
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch {
      return dateString;
    }
  };

  // Utility to format prices in paise to rupees
  const formatPrice = (amountPaise?: number) => {
    if (amountPaise === undefined || amountPaise === null) return 'N/A';
    return `₹${(amountPaise / 100).toLocaleString()}`;
  };

  // Filter input fields configurations
  const filterFields: Field[] = [
    {
      type: 'text',
      name: 'search',
      label: 'Search User',
      placeholder: 'Search name, email, or company...',
      value: formData.search,
      onChange: handleInputChange,
    },
    {
      type: 'dropdown',
      name: 'status',
      label: 'Account Status',
      placeholder: 'All Statuses',
      value: formData.status,
      onChange: handleInputChange,
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active Only' },
        { value: 'BLOCKED', label: 'Blocked Only' },
      ],
    },
  ];

  // Action buttons configured for the filter panel
  const filterButtons: ActionButton[] = [
    {
      text: 'Apply Filters',
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
      text: isLoading ? 'Syncing...' : 'Sync Feed',
      onClick: refresh,
      variant: 'outline',
      icon: <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />,
      disabled: isLoading,
    },
  ];

  // Table Columns Setup
  const tableColumns: TableColumn<User>[] = [
    {
      header: 'Client / Operator Profile',
      accessor: (item: User) => (
        <div className="flex items-center gap-3 text-left">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold font-sans text-sm shrink-0 border border-indigo-500/10">
              {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white leading-tight">{item.name || 'Anonymous User'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{item.email}</span>
          </div>
        </div>
      ),
      align: 'left' as const,
    },
    {
      header: 'Phone Number',
      accessor: (item: User) => item.phone || 'N/A',
      align: 'center' as const,
    },
    {
      header: 'Subscribed Plan',
      accessor: (item: User) => {
        const plan = item.subscription;
        if (!plan) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-900/60 text-slate-500 border border-slate-200/50 dark:border-slate-800/30">
              No Active Plan
            </span>
          );
        }
        const badgeColors: Record<string, string> = {
          ACTIVE: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30',
          PENDING: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30',
          CANCELLED: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/30',
          PAST_DUE: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/30',
        };
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {plan.planName || 'Active Package'}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${badgeColors[plan.status] || ''}`}>
              {plan.status}
            </span>
          </div>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Sign-up Date',
      accessor: (item: User) => formatDate(item.createdAt),
      align: 'center' as const,
    },
    {
      header: 'Access Role',
      accessor: (item: User) => {
        const roleColors: Record<string, string> = {
          admin: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
          client: 'bg-pink-500/10 text-pink-500 border border-pink-500/20',
          public: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleColors[item.role] || ''}`}>
            {item.role}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Account Status',
      accessor: (item: User) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            item.isActive
              ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
          }`}>
            {item.isActive ? 'Active' : 'Blocked'}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Operations',
      accessor: (item: User) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => openDetailsModal(item.id)}
            className="inline-flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold px-2.5 py-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Eye size={13} />
            Details
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="text-indigo-500" size={24} />
            Client Accounts Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and inspect registered business profiles, onboarding, and client accounts</p>
        </div>
      </div>

      {/* Filter Options */}
      <InputWithButtons
        fields={filterFields}
        buttons={filterButtons}
        gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />

      {/* Main Table view */}
      <div className="animate-fade-in">
        <ReusableTable
          data={tableData}
          columns={tableColumns}
          keyExtractor={(item) => item.id}
          loading={isLoading}
          pagination={pagination}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          showExport={false}
        />
      </div>

      {/* Modal Profile Dialog */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop Scrim */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
            onClick={closeDetailsModal}
          />

          {/* Modal Content container */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0e121a] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl z-10 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center gap-3.5">
                {selectedUser?.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/10 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-500/10">
                    {selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-base font-black text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    {selectedUser?.name || 'Anonymous User'}
                    {selectedUser?.role === 'admin' && (
                      <span className="text-[9px] font-bold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase">
                        Operator
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">ID: {selectedUserId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedUser && (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(selectedUser)}
                    disabled={isUpdatingStatus}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedUser.isActive
                        ? 'text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white'
                        : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    {selectedUser.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                    {selectedUser.isActive ? 'Block Account' : 'Unblock Account'}
                  </button>
                )}
                
                <button
                  onClick={closeDetailsModal}
                  aria-label="Close"
                  title="Close"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Loading / Content section */}
            {detailsLoading ? (
              <div className="p-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Fetching detailed client record...</span>
              </div>
            ) : selectedUser ? (
              <>
                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 px-4">
                  {[
                    { id: 'profile', label: 'User Overview', icon: <User size={14} /> },
                    { id: 'onboarding', label: 'Business Onboarding', icon: <Building size={14} /> },
                    { id: 'subscription', label: 'Subscription details', icon: <Activity size={14} /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'border-pink-600 text-pink-600 dark:border-pink-500 dark:text-pink-400'
                          : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Scrollable details view */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[55vh]">
                  
                  {/* TAB: PROFILE */}
                  {activeTab === 'profile' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-start gap-3">
                          <Mail size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                            <a
                              href={`mailto:${selectedUser.email}`}
                              className="font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                            >
                              {selectedUser.email}
                            </a>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-start gap-3">
                          <Phone size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone Number</span>
                            <a
                              href={selectedUser.phone ? `tel:${selectedUser.phone}` : '#'}
                              className={`font-bold text-xs ${
                                selectedUser.phone
                                  ? 'text-indigo-600 dark:text-indigo-400 hover:underline'
                                  : 'text-slate-500'
                              }`}
                            >
                              {selectedUser.phone || 'No phone added'}
                            </a>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-start gap-3">
                          <Calendar size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Since</span>
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {formatDate(selectedUser.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-start gap-3">
                          <Shield size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Operator Permissions</span>
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {selectedUser.role} Portal Access
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary card */}
                      <div className="p-4 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 border border-indigo-500/10 rounded-2xl">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                          <Laptop size={14} className="text-indigo-400" />
                          Operator Account Status
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          This user is currently logged in as a <strong>{selectedUser.role}</strong> status member. 
                          {selectedUser.isActive 
                            ? ' The account has full operational permissions to sign into workspaces and purchase services.'
                            : ' This account is suspended/blocked. Access to customer portal sections is restricted.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB: ONBOARDING */}
                  {activeTab === 'onboarding' && (
                    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
                      {selectedUser.onboarding ? (
                        <div className="space-y-6">
                          
                          {/* Main Business Profile Card */}
                          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl space-y-4">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-150 dark:border-slate-800/60 pb-2 flex items-center gap-1.5">
                              <Building size={14} className="text-pink-500" />
                              Company Profile
                            </h5>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Company Name</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.companyName || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Industry</span>
                                <span className="font-bold text-slate-950 dark:text-white">{selectedUser.onboarding.industry || 'N/A'}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">About Business</span>
                                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-0.5 font-sans whitespace-pre-wrap">
                                  {selectedUser.onboarding.aboutBusiness || 'No detailed background provided.'}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Demographics</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.targetAudience || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Location</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.targetLocation || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Team Size</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.teamSize || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Use Case</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.useCase || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Branding Details */}
                          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl space-y-4">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-150 dark:border-slate-800/60 pb-2 flex items-center gap-1.5">
                              <Compass size={14} className="text-pink-500" />
                              Branding & Asset Assets
                            </h5>

                            <div className="space-y-4 text-xs">
                              {/* Color swatch rendering helper */}
                              {selectedUser.onboarding.brandColors ? (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Brand Color Palette</span>
                                  <div className="flex flex-wrap gap-2 pt-0.5">
                                    {selectedUser.onboarding.brandColors.split(',').map((color: string, idx: number) => {
                                      const trimmedColor = color.trim();
                                      return (
                                        <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full">
                                          <span
                                            className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                                            style={{ backgroundColor: trimmedColor }}
                                          />
                                          <span className="font-mono font-extrabold text-[10px] text-slate-700 dark:text-slate-300 uppercase select-all">
                                            {trimmedColor}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Brand Color Palette</span>
                                  <span className="text-xs text-slate-500">Not specified</span>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reference / Competitor Websites</span>
                                  <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold truncate mt-0.5">
                                    {selectedUser.onboarding.referenceWebsites || 'No competitor references provided'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pages Required</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.pagesNeeded || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Competitors</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.competitors || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Demographics & Media permissions */}
                          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl space-y-4">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-150 dark:border-slate-800/60 pb-2 flex items-center gap-1.5">
                              <Building size={14} className="text-pink-500" />
                              Social Networks & Advertising Budget
                            </h5>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="col-span-2">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Social Handles (URLs)</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                                  {selectedUser.onboarding.socialMediaLinks || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Meta Ads / FB Access</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.instagramFacebookAccess || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Marketing Budget</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.onboarding.budget || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-200/20">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Onboarding checklist incomplete</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">This customer has not filled in their branding goals form yet.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: SUBSCRIPTION */}
                  {activeTab === 'subscription' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      {selectedUser.subscription ? (
                        <div className="space-y-4">
                          
                          {/* Plan Status Card */}
                          <div className="p-5 bg-gradient-to-br from-indigo-900/10 to-pink-900/10 border border-indigo-500/15 rounded-2xl flex flex-col justify-between gap-4">
                            <div>
                              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Active Client Subscription</span>
                              <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {selectedUser.subscription.planName || 'Digital Growth Package'}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Subscription Reference ID: {selectedUser.subscription.razorpaySubscriptionId || 'Local'}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-indigo-500/10">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Plan Cost</span>
                                <span className="font-extrabold text-sm text-pink-600 dark:text-pink-400">
                                  {formatPrice(selectedUser.subscription.amount)}
                                </span>
                              </div>

                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Billing Cycle</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px]">
                                  {selectedUser.subscription.billingCycle || 'Monthly'}
                                </span>
                              </div>

                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Payments Status</span>
                                <span className="inline-flex items-center px-1.5 py-0.5 mt-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {selectedUser.subscription.status}
                                </span>
                              </div>

                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Next Renewal</span>
                                <span className="font-bold text-slate-850 dark:text-slate-200">
                                  {selectedUser.subscription.renewalDate ? format(new Date(selectedUser.subscription.renewalDate), 'dd MMM yyyy') : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Razorpay Link */}
                          {selectedUser.subscription.razorpaySubscriptionId && (
                            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-500 shrink-0" />
                                <div>
                                  <span className="font-bold block">Razorpay Subscription ID</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{selectedUser.subscription.razorpaySubscriptionId}</span>
                                </div>
                              </div>
                              <a
                                href={`https://dashboard.razorpay.com/app/subscriptions/${selectedUser.subscription.razorpaySubscriptionId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-600 font-bold hover:underline"
                              >
                                Razorpay Console
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-200/20">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-350">No Subscription Found</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">This customer account has no active invoice plan associated with it.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex justify-end">
                  <button
                    type="button"
                    onClick={closeDetailsModal}
                    className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white rounded-xl transition-all cursor-pointer"
                  >
                    Close Dialog
                  </button>
                </div>
              </>
            ) : null}

          </div>
        </div>
      )}
    </div>
  );
}