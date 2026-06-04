import { Metadata } from 'next';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export const metadata: Metadata = {
  title: 'Client Portal — Growth Agency Dashboard',
  description: 'Manage active deliverables, pick brand colors, and inspect advertising leads.',
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout type="client">{children}</ProtectedLayout>;
}
