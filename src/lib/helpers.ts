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
    const parts = token?.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as DecodedToken;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

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
export const getSessionUserInfo = (type: 'admin'): DecodedToken | null => {
  const token = getAdminToken();
  return token ? decodeJWT(token) : null;
};
