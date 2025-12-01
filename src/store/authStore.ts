import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        set({
          user: response.user,
          accessToken: response.access,
          refreshToken: response.refresh,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      loadUser: async () => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
          try {
            const user = await authService.me();
            set({
              user,
              accessToken: token,
              refreshToken: localStorage.getItem('refresh_token'),
              isAuthenticated: true,
            });
          } catch (error) {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
