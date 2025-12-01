import api from '@/lib/api';

export interface Coleta {
  id: number;
  bombona: number;
  bombona_detalhes?: any;
  operador: number;
  operador_nome: string;
  data_coleta: string;
  peso_coletado: string;
  destino: string;
  empresa_destino?: string;
  status: string;
  status_display: string;
  observacoes?: string;
  numero_manifesto?: string;
}

export const coletaService = {
  getAll: async (params?: any) => {
    const response = await api.get('/coletas/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/coletas/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Coleta>) => {
    const response = await api.post('/coletas/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Coleta>) => {
    const response = await api.put(`/coletas/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/coletas/${id}/`);
    return response.data;
  },

  getEstatisticas: async () => {
    const response = await api.get('/coletas/estatisticas/');
    return response.data;
  },
};
