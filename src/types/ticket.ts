export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  status: TicketStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

// Mock Data
export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    clientId: "USR-101",
    clientName: "Rahul Sharma",
    subject: "Website not loading properly on mobile",
    status: "Open",
    category: "Technical Issue",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      {
        id: "MSG-001",
        senderId: "USR-101",
        senderName: "Rahul Sharma",
        senderRole: "client",
        content: "Hi team, my new website is looking very weird on iPhone. The buttons are overlapping.",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ]
  },
  {
    id: "TKT-002",
    clientId: "USR-101",
    clientName: "Rahul Sharma",
    subject: "Change logo in social media posts",
    status: "In Progress",
    category: "Design Change",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    messages: [
      {
        id: "MSG-002",
        senderId: "USR-101",
        senderName: "Rahul Sharma",
        senderRole: "client",
        content: "I want to update the logo used in the social media creatives. I have uploaded the new logo.",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        attachment: {
          name: "new_logo_vector.png",
          url: "#",
          type: "image/png"
        }
      },
      {
        id: "MSG-003",
        senderId: "ADM-001",
        senderName: "Support Team",
        senderRole: "admin",
        content: "We have received your new logo. Our design team will update the upcoming posts.",
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
      }
    ]
  },
  {
    id: "TKT-003",
    clientId: "USR-102",
    clientName: "Priya Patel",
    subject: "Need more leads this month",
    status: "Resolved",
    category: "Marketing",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    messages: [
      {
        id: "MSG-004",
        senderId: "USR-102",
        senderName: "Priya Patel",
        senderRole: "client",
        content: "The leads from last week were not very good. Can we change the target audience?",
        timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "MSG-005",
        senderId: "ADM-001",
        senderName: "Support Team",
        senderRole: "admin",
        content: "We have updated the ad targeting to focus more on your specific locality. You should see better results in a few days.",
        timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
      }
    ]
  }
];
