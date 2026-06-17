import {
  LayoutDashboard,
  FileCheck,
  Users,
  MessageSquare,
  CreditCard,
  ListTodo,
  UserCheck,
  Headphones,
} from "lucide-react";

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
  matchPath?: string;
  permission?: string;
  alwaysVisible?: boolean;
  subtabs?: SubTab[];
}

export const clientMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/client/dashboard",
    alwaysVisible: true,
  },
  {
    name: "Support",
    icon: Headphones,
    link: "/client/support",
    alwaysVisible: true,
  },
];

export const adminMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin/dashboard",
    alwaysVisible: true,
  },
  {
    name: "Inquiries",
    icon: MessageSquare,
    link: "/admin/inquiries",
    alwaysVisible: true,
  },
  {
    name: "Users",
    icon: Users,
    link: "/admin/users",
    alwaysVisible: true,
  },
  {
    name: "Subscription Plans",
    icon: ListTodo,
    link: "/admin/plans",
    alwaysVisible: true,
  },
  {
    name: "Payments & Invoices",
    icon: CreditCard,
    link: "/admin/payments",
    alwaysVisible: true,
  },
  {
    name: "Admin Settings",
    icon: UserCheck,
    alwaysVisible: true,
    link: "/admin/admins/manageAdmin",
    matchPath: "/admin/admins",
  },
  {
    name: "Support Tickets",
    icon: Headphones,
    link: "/admin/support",
    alwaysVisible: true,
  },
];
