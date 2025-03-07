import { create } from 'zustand';
import { api, setAuthToken } from '../lib/api';

interface AuthState {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

// Function to get token safely (avoid localStorage errors)
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getToken(),

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAuthToken(res.data.accessToken);
    set({ token: res.data.accessToken });
  },

  signup: async (email, password, name) => {
    await api.post('/auth/signup', { email, password, name });
  },

  logout: () => {
    setAuthToken(null);
    set({ token: null, user: null });
  },
}));
