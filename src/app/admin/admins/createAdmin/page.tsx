'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '@/lib/api-client';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';

const ROLES = [
  { value: 'STAFF', label: 'Staff' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

const PERMISSIONS = [
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

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    name: '',
    password: '',
    role: 'STAFF',
    permissions: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionsChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, permissions: values }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.adminId || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/admin/admins', formData);
      toast.success('Admin created successfully!');
      router.push('/admin/admins/manageAdmin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields: Field[] = [
    {
      type: 'text',
      name: 'adminId',
      label: 'Admin ID / Username',
      placeholder: 'e.g., staff_001',
      value: formData.adminId,
      onChange: handleChange,
      required: true,
    },
    {
      type: 'text',
      name: 'name',
      label: 'Full Name',
      placeholder: 'e.g., John Doe',
      value: formData.name,
      onChange: handleChange,
      required: true,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Temporary Password',
      placeholder: 'Enter secure password',
      value: formData.password,
      onChange: handleChange,
      required: true,
    },
    {
      type: 'dropdown',
      name: 'role',
      label: 'Role',
      value: formData.role,
      onChange: handleChange,
      options: ROLES,
      required: true,
    },
    {
      type: 'multiselect',
      name: 'permissions',
      label: 'Permissions',
      value: formData.permissions,
      onMultiSelectChange: handlePermissionsChange,
      options: PERMISSIONS,
    },
  ];

  const buttons: ActionButton[] = [
    {
      text: 'Cancel',
      variant: 'outline',
      icon: <X size={16} />,
      onClick: () => router.push('/admin/admins/manageAdmin'),
      disabled: loading,
    },
    {
      text: loading ? 'Saving...' : 'Save Admin',
      variant: 'primary',
      icon: <Save size={16} />,
      onClick: handleSave,
      disabled: loading,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="max-w-4xl">
        <InputWithButtons
          fields={fields}
          buttons={buttons}
          gridClass="grid-cols-1 md:grid-cols-2"
        />
      </div>
    </div>
  );
}
