import api from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  tipo_usuario: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  tipo_usuario: string;
  is_active: boolean;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh/', { refresh: refreshToken });
    return response.data;
  },
};
