import {
  LayoutDashboard,
  FileCheck,
  Users,
  MessageSquare,
  CreditCard,
  ListTodo,
  UserCheck,
  Globe,
  Share2,
  TrendingUp,
  FolderOpen,
  LifeBuoy,
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
    name: "Website",
    icon: Globe,
    link: "/client/website",
    alwaysVisible: true,
  },
  {
    name: "Social Media",
    icon: Share2,
    link: "/client/social-media",
    alwaysVisible: true,
  },
  {
    name: "Leads",
    icon: TrendingUp,
    link: "/client/leads",
    alwaysVisible: true,
  },
  {
    name: "Files & Assets",
    icon: FolderOpen,
    link: "/client/assets",
    alwaysVisible: true,
  },
  {
    name: "Billing",
    icon: CreditCard,
    link: "/client/billing",
    alwaysVisible: true,
  },
  {
    name: "Support Desk",
    icon: LifeBuoy,
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
    name: "Admin Settings",
    icon: UserCheck,
    alwaysVisible: true,
    link: "/admin/admins/manageAdmin",
    matchPath: "/admin/admins",
  },
];
