'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '@/lib/api-client';

interface StaffAdmin {
  _id?: string;
  id?: string;
  adminId: string;
  name: string;
  role: string;
  permissions: string[];
}

export default function ManageAdminsPage() {
  const router = useRouter();
  const [data, setData] = useState<StaffAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<StaffAdmin | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', permissions: [] as string[] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/admin/admins');
        setData(response.data?.data || response.data || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this admin?')) {
      try {
        await apiClient.delete(`/admin/admins/${id}`);
        setData((prev) => prev.filter((admin) => (admin._id || admin.id) !== id));
        toast.success('Admin deactivated successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to deactivate admin');
      }
    }
  };

  const handleEditClick = (admin: StaffAdmin) => {
    setEditingAdmin(admin);
    setEditFormData({
      name: admin.name,
      permissions: admin.permissions || [],
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingAdmin || !editFormData.name) {
      toast.error('Name is required');
      return;
    }
    const id = editingAdmin._id || editingAdmin.id;
    setSaving(true);
    try {
      await apiClient.patch(`/admin/admins/${id}`, editFormData);
      toast.success('Admin updated successfully');
      setData((prev) =>
        prev.map((admin) =>
          (admin._id || admin.id) === id
            ? { ...admin, name: editFormData.name, permissions: editFormData.permissions }
            : admin
        )
      );
      setEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update admin');
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionToggle = (perm: string) => {
    setEditFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const AVAILABLE_PERMISSIONS = [
    { value: 'users:read', label: 'View Users' },
    { value: 'users:write', label: 'Manage Users' },
    { value: 'tasks:read', label: 'View Tasks' },
    { value: 'tasks:write', label: 'Manage Tasks' },
    { value: 'billing:read', label: 'View Billing' },
    { value: 'billing:write', label: 'Manage Billing' },
    { value: 'contacts:read', label: 'View Contacts' },
    { value: 'contacts:write', label: 'Manage Contacts' },
    { value: 'content:approve', label: 'Approve Content' },
    { value: 'settings:manage', label: 'Manage Settings' },
  ];

  const columns: TableColumn<StaffAdmin>[] = [
    { header: 'Admin ID', accessor: 'adminId', align: 'left' },
    { header: 'Name', accessor: 'name', align: 'left' },
    {
      header: 'Role',
      accessor: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === 'SUPER_ADMIN'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          {row.role.replace('_', ' ')}
        </span>
      ),
      align: 'center',
    },
    {
      header: 'Permissions',
      accessor: (row) => (
        <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
          {row.permissions && row.permissions.length > 0 ? (
            row.permissions.map((perm, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                {perm}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-400">None</span>
          )}
        </div>
      ),
      align: 'center',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors"
            title="Edit Admin"
          >
            <Pencil size={16} />
          </button>
          {row.role !== 'SUPER_ADMIN' && (
            <button
              onClick={() => handleDelete((row._id || row.id) as string)}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Deactivate Admin"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="space-y-6">
      <ReusableTable
        data={data}
        columns={columns}
        keyExtractor={(item) => (item._id || item.id) as string}
        loading={loading}
      />

      {/* Edit Modal */}
      {editModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Admin</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label htmlFor="edit-adminId" className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Admin ID
                </label>
                <input
                  id="edit-adminId"
                  type="text"
                  value={editingAdmin.adminId}
                  disabled
                  className="w-full h-10 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Admin ID cannot be changed.</p>
              </div>

              <div>
                <label htmlFor="edit-name" className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Permissions
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (editFormData.permissions.length === AVAILABLE_PERMISSIONS.length) {
                        setEditFormData((prev) => ({ ...prev, permissions: [] }));
                      } else {
                        setEditFormData((prev) => ({ ...prev, permissions: AVAILABLE_PERMISSIONS.map((p) => p.value) }));
                      }
                    }}
                    className="text-xs font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    {editFormData.permissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        aria-label={`Permission ${perm.label}`}
                        checked={editFormData.permissions.includes(perm.value)}
                        onChange={() => handlePermissionToggle(perm.value)}
                        className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="truncate">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
