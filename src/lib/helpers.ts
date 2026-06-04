// JWT and Session management helper utilities (client-side only)

export interface DecodedToken {
  userId: string;
  username: string;
  name: string;
  role: 'admin' | 'client' | 'public';
  permissions: string[];
  planTier?: string;
  exp: number;
}

/**
 * Decodes a mock JWT (Base64 URL encoded payload)
 */
export const decodeJWT = (token: string): DecodedToken | null => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as DecodedToken;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// --- Public Customer Helpers ---
export const getPublicToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('publicToken') || sessionStorage.getItem('publicToken');
};

export const setPublicToken = (token: string, rememberMe = true): void => {
  if (typeof window === 'undefined') return;
  if (rememberMe) {
    localStorage.setItem('publicToken', token);
  } else {
    sessionStorage.setItem('publicToken', token);
  }
};

export const clearPublicToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('publicToken');
  sessionStorage.removeItem('publicToken');
};

export const isPublicLoggedIn = (): boolean => !!getPublicToken();

// --- Client / User Portal Helpers ---
export const getClientToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('clientToken');
};

export const setClientToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('clientToken', token);
};

export const clearClientToken = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('clientToken');
};

export const isClientLoggedIn = (): boolean => !!getClientToken();

// --- Admin Portal Helpers ---
export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('adminToken');
};

export const setAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('adminToken', token);
};

export const clearAdminToken = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('adminToken');
};

export const isAdminLoggedIn = (): boolean => !!getAdminToken();

// --- Helpers to extract user information from tokens ---
export const getSessionUserInfo = (type: 'client' | 'admin' | 'public'): DecodedToken | null => {
  const token = type === 'admin' 
    ? getAdminToken() 
    : type === 'client' 
    ? getClientToken() 
    : getPublicToken();
    
  return token ? decodeJWT(token) : null;
};
