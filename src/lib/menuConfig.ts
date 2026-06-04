import {
  LayoutDashboard,
  FileCheck,
  Users,
  MessageSquare,
  CreditCard,
  ListTodo,
  UserCheck
} from 'lucide-react';

export interface SubTab {
  name: string;
  link: string;
  permission?: string;
  alwaysVisible?: boolean;
}

export interface MenuItem {
  name: string;
  icon: any; // Using any to avoid strict JSX typing issues with different React environments
  link?: string;
  permission?: string;
  alwaysVisible?: boolean;
  subtabs?: SubTab[];
}

export const clientMenuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    link: '/client/dashboard',
    alwaysVisible: true,
  },
];

export const adminMenuItems: MenuItem[] = [
  {
    name: 'Admin Dashboard',
    icon: LayoutDashboard,
    link: '/admin/dashboard',
    alwaysVisible: true,
  },
];
