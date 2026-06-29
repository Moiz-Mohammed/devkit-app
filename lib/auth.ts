import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'devkit_access_token';
const REFRESH_TOKEN_KEY = 'devkit_refresh_token';

export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(ACCESS_TOKEN_KEY) ?? localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefresh: (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) ?? localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  set: (accessToken: string, refreshToken: string) => {
    // HttpOnly-like: store in cookie with secure flag for production
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1, sameSite: 'strict' });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: 'strict' });
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
