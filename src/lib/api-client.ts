import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAdminToken, getClientToken, getPublicToken, clearAdminToken, clearClientToken, clearPublicToken } from './helpers';

// Configure active baseURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.growthagency.local';

// Toggle Mock Mode: Set to false when your actual backend repository is connected
const MOCK_MODE = true;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach correct token based on current route
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      let token = '';
      
      if (path.startsWith('/admin')) {
        token = getAdminToken() || '';
      } else if (path.startsWith('/client')) {
        token = getClientToken() || '';
      } else {
        token = getPublicToken() || '';
      }

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle JWT Expirations (401 status)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/admin')) {
          clearAdminToken();
          window.location.href = '/admin';
        } else if (path.startsWith('/client')) {
          clearClientToken();
          window.location.href = '/client';
        } else {
          clearPublicToken();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ========================================================
// CLIENT-SIDE API MOCK ADAPTER FOR DEVELOPMENT
// ========================================================
if (MOCK_MODE && typeof window !== 'undefined') {
  // Helper to generate a mock JWT base64 string
  const generateMockJWT = (payload: object) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const pay = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 }));
    const signature = 'mock_signature_part';
    return `${header}.${pay}.${signature}`;
  };

  // Seed default DB
  const getDb = () => {
    const raw = sessionStorage.getItem('growth_agency_db');
    if (raw) return JSON.parse(raw);

    const initialDb = {
      users: [
        { username: 'admin', password: 'password123', role: 'admin', name: 'Super Admin', permissions: ['all'] },
        { username: 'client', password: 'password123', role: 'client', name: 'Giva Jewellers', permissions: ['view_leads'], planTier: 'business_pro', businessName: 'Giva Jewellers', brandColors: ['#db2777', '#f472b6'], logoUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&h=150&q=80', onboardingCompleted: true },
        { username: 'buyer', password: 'password123', role: 'public', name: 'Rohan Sharma', permissions: [] }
      ],
      tasks: [
        { id: 't1', title: 'Design Brand Logo & Colors', description: 'Create brand logo guidelines and pick secondary shades.', type: 'design', status: 'completed', assignedTo: 'Designer Dev', clientApproved: true },
        { id: 't2', title: 'Landing Page Setup', description: 'Build and deploy the premium e-commerce storefront landing preview.', type: 'development', status: 'review', assignedTo: 'Frontend Dev', clientApproved: false, deliverables: [{ type: 'link', url: 'https://giva-jewellery.local', name: 'Live Website Preview' }] },
        { id: 't3', title: 'Set up Facebook Lead Ads', description: 'Design carousel creatives and target local pin codes.', type: 'ads', status: 'in_progress', assignedTo: 'Ads Manager', clientApproved: false },
        { id: 't4', title: 'Weekly SEO Audit Report', description: 'Crawl page performance and index sitemaps.', type: 'seo', status: 'pending', assignedTo: 'SEO Lead', clientApproved: false }
      ],
      leads: [
        { id: 1, name: 'Amit Patel', email: 'amit.patel@gmail.com', phone: '+91 98765 43210', source: 'Facebook Lead Ads', date: '2026-06-02T18:30:00.000Z' },
        { id: 2, name: 'Pooja Rao', email: 'pooja.rao@yahoo.com', phone: '+91 91234 56789', source: 'Instagram Stories', date: '2026-06-02T19:45:00.000Z' },
        { id: 3, name: 'Vikram Singh', email: 'vikram.s@outlook.com', phone: '+91 88888 77777', source: 'Google Search Ads', date: '2026-06-01T10:15:00.000Z' },
        { id: 4, name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 98712 34567', source: 'Facebook Lead Ads', date: '2026-05-31T14:20:00.000Z' },
        { id: 5, name: 'Kabir Mehta', email: 'kabir.mehta@gmail.com', phone: '+91 95555 43210', source: 'Instagram Stories', date: '2026-05-30T11:05:00.000Z' }
      ],
      tickets: [
        { id: 'tk1', subject: 'Change Target Area for Facebook Ads', message: 'We want to shift targeting from South Delhi to West Delhi clinics.', date: '2026-06-02T12:00:00.000Z', status: 'Open' },
        { id: 'tk2', subject: 'Inquire about Google Shopping Setup', message: 'Does our Pro Plan include setup of Google Merchant Center?', date: '2026-05-28T09:00:00.000Z', status: 'Resolved', reply: 'Yes, it does! We have completed Merchant setup and it is currently undergoing Google approval.' }
      ],
      purchasedSubscriptions: [
        { id: 'sub1', planName: 'Business Pro Plan', price: '₹3,999/mo', status: 'active', paymentDate: '2026-06-03T11:00:00+05:30' }
      ]
    };
    sessionStorage.setItem('growth_agency_db', JSON.stringify(initialDb));
    return initialDb;
  };

  const saveDb = (db: object) => {
    sessionStorage.setItem('growth_agency_db', JSON.stringify(db));
  };

  // Custom Axios Adapter to intercept HTTP requests
  apiClient.defaults.adapter = async (config) => {
    const db = getDb();
    const url = config.url || '';
    const method = config.method || 'get';
    const body = config.data ? JSON.parse(config.data) : null;
    
    // Simulate delay
    await new Promise(r => setTimeout(r, 400));

    // 1. Auth Endpoint
    if (url.includes('/auth/login')) {
      const { username, password, role } = body;
      const user = db.users.find((u: any) => u.username === username && u.password === password && u.role === role);
      if (user) {
        const token = generateMockJWT({
          userId: user.username,
          username: user.username,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          planTier: user.planTier || ''
        });
        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: { success: true, token, name: user.name, role: user.role, permissions: user.permissions }
        };
      } else {
        return {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config,
          data: { success: false, message: 'Invalid username or password credentials.' }
        } as any;
      }
    }

    // 2. Register Endpoint
    if (url.includes('/auth/register')) {
      const { username, password, name } = body;
      if (db.users.some((u: any) => u.username === username)) {
        return {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config,
          data: { success: false, message: 'Username already exists.' }
        } as any;
      }
      
      const newUser = { username, password, name, role: 'public', permissions: [] };
      db.users.push(newUser);
      saveDb(db);

      const token = generateMockJWT({
        userId: username,
        username,
        name,
        role: 'public',
        permissions: []
      });

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, token, name, role: 'public' }
      };
    }

    // 3. Purchase Subscription Endpoint
    if (url.includes('/subscriptions/purchase')) {
      const { planName, price } = body;
      const newSub = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        planName,
        price,
        status: 'active',
        paymentDate: new Date().toISOString()
      };
      db.purchasedSubscriptions.push(newSub);
      
      // Update client user settings
      const clientUser = db.users.find((u: any) => u.username === 'client');
      if (clientUser) {
        clientUser.planTier = planName.toLowerCase().includes('starter') ? 'growth_starter' : planName.toLowerCase().includes('pro') ? 'business_pro' : 'enterprise_scale';
      }
      
      saveDb(db);
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, subscription: newSub }
      };
    }

    // 4. Tasks Endpoints
    if (url.includes('/tasks')) {
      // Update individual task status
      if (method === 'put' || method === 'PUT') {
        const taskId = url.split('/').pop();
        const taskIndex = db.tasks.findIndex((t: any) => t.id === taskId);
        if (taskIndex !== -1) {
          db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...body };
          saveDb(db);
          return {
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            data: { success: true, task: db.tasks[taskIndex] }
          };
        }
      }

      // Add a new task (Admin)
      if (method === 'post' || method === 'POST') {
        const newTask = {
          id: 't' + (db.tasks.length + 1),
          title: body.title,
          description: body.description,
          type: body.type,
          status: 'pending',
          assignedTo: body.assignedTo || 'Unassigned',
          clientApproved: false
        };
        db.tasks.push(newTask);
        saveDb(db);
        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: { success: true, task: newTask }
        };
      }

      // GET tasks list
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, tasks: db.tasks }
      };
    }

    // 5. Leads Endpoints
    if (url.includes('/leads')) {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, leads: db.leads }
      };
    }

    // 6. Tickets Endpoints
    if (url.includes('/tickets')) {
      if (method === 'post' || method === 'POST') {
        const newTicket = {
          id: 'tk' + (db.tickets.length + 1),
          subject: body.subject,
          message: body.message,
          date: new Date().toISOString(),
          status: 'Open'
        };
        db.tickets.push(newTicket);
        saveDb(db);
        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: { success: true, ticket: newTicket }
        };
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, tickets: db.tickets }
      };
    }

    // Default fallback
    return {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config,
      data: { success: false, message: `Mock endpoint for ${url} not found.` }
    } as any;
  };
}

export default apiClient;
