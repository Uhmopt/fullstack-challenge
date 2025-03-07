import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { api, setAuthToken } from '../lib/api';

interface AuthState {
  user: any;
  token: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

// Function to get token safely (avoid localStorage errors)
// const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
const getToken = () => {
  if (typeof window === "undefined") return null; // ✅ Prevents SSR access
  return localStorage.getItem("accessToken");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAuthToken(res.data.accessToken);
    set({ token: res.data.accessToken, user: res.data.user, isHydrated: true });
  },

  signup: async (email, password, name) => {
    await api.post('/auth/signup', { email, password, name });
  },

  logout: () => {
    setAuthToken(null);
    set({ token: null, user: null, isHydrated: false });
  },
}));

export function useHydratedAuthStore() {
  const [hydrated, setHydrated] = useState(false);
  const store = useAuthStore();

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setAuthToken(storedToken);
      useAuthStore.setState({ token: storedToken, isHydrated: true });
    } else {
      useAuthStore.setState({ isHydrated: true });
    }
    setHydrated(true);
  }, []);

  return hydrated ? store : { ...store, token: null, user: null };
}