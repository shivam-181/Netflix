import { create } from 'zustand';
import api from '@/lib/axios'; // The axios instance we made earlier

interface User {
  _id: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void; // Helper to set user from token/API later
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token to localStorage so it persists on refresh
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Simple persistence
      
      set({ token, user, isLoading: false });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Login failed' 
      });
      throw err; // Re-throw so the UI can handle redirects
    }
  },
  
  setUser: (user) => set({ user }),

  signup: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/signup', { email, password });
      set({ isLoading: false });
      // We don't auto-login on signup (Netflix flows usually ask you to login after)
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Signup failed' 
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

// Initialize user from localStorage if exists (client-side only trick)
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    useAuthStore.getState().setUser(JSON.parse(savedUser));
  }
}