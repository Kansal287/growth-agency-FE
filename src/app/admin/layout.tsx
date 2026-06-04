import { Metadata } from 'next';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export const metadata: Metadata = {
  title: 'Admin Desk — Agency Operations Workspace',
  description: 'Manage active customer pipelines, update task reviews, and inspect billing statistics.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout type="admin">{children}</ProtectedLayout>;
}
