import api from '@/lib/api';

export const relatorioService = {
  getMensal: async (ano?: number, mes?: number) => {
    const params = { ano, mes };
    const response = await api.get('/relatorios/mensal/', { params });
    return response.data;
  },

  getPorTipo: async () => {
    const response = await api.get('/relatorios/por-tipo/');
    return response.data;
  },

  getPorEmpresa: async () => {
    const response = await api.get('/relatorios/por-empresa/');
    return response.data;
  },

  getEvolucaoColetas: async (meses?: number) => {
    const params = { meses };
    const response = await api.get('/relatorios/evolucao-coletas/', { params });
    return response.data;
  },

  getDashboardKPIs: async () => {
    const response = await api.get('/relatorios/dashboard-kpis/');
    return response.data;
  },
};
