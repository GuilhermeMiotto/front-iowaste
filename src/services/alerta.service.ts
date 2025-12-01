import api from '@/lib/api';

export interface Alerta {
  id: number;
  bombona: number;
  bombona_identificacao: string;
  tipo: string;
  tipo_display: string;
  nivel: string;
  nivel_display: string;
  nivel_color: string;
  descricao: string;
  resolvido: boolean;
  data_resolucao?: string;
  observacoes_resolucao?: string;
  data_alerta: string;
}

export const alertaService = {
  getAll: async (params?: any) => {
    const response = await api.get('/alertas/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/alertas/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Alerta>) => {
    const response = await api.post('/alertas/', data);
    return response.data;
  },

  resolver: async (id: number, observacoes?: string) => {
    const response = await api.post(`/alertas/${id}/resolver/`, { observacoes });
    return response.data;
  },

  getEstatisticas: async () => {
    const response = await api.get('/alertas/estatisticas/');
    return response.data;
  },
};
