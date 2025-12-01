import api from '@/lib/api';

export interface Bombona {
  id: number;
  identificacao: string;
  empresa: number;
  empresa_detalhes?: any;
  latitude: string;
  longitude: string;
  endereco_instalacao: string;
  capacidade: string;
  tipo_residuo: string;
  tipo_residuo_display: string;
  status: string;
  status_display: string;
  status_color: string;
  peso_atual: string;
  temperatura: string;
  percentual_ocupacao: number;
  necessita_coleta: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const bombonaService = {
  getAll: async (params?: any) => {
    const response = await api.get('/bombonas/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/bombonas/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Bombona>) => {
    const response = await api.post('/bombonas/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Bombona>) => {
    const response = await api.put(`/bombonas/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/bombonas/${id}/`);
    return response.data;
  },

  getMapa: async (params?: any) => {
    const response = await api.get('/bombonas/mapa/', { params });
    return response.data;
  },

  getEstatisticas: async () => {
    const response = await api.get('/bombonas/estatisticas/');
    return response.data;
  },

  atualizarStatus: async (id: number, status: string) => {
    const response = await api.post(`/bombonas/${id}/atualizar-status/`, { status });
    return response.data;
  },

  getHistorico: async (id: number) => {
    const response = await api.get(`/bombonas/${id}/historico/`);
    return response.data;
  },
};
