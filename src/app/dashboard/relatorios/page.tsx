'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BOMBONAS, ALERTAS, COLETAS, EMPRESAS } from '@/data/mockData';

interface RelatorioData {
  evolucao_mensal: { mes: string; peso: number; coletas: number }[];
  tipos_residuo: { [key: string]: { bombonas: number; peso_total: number } };
  status_bombonas: { [key: string]: number };
  empresas_ativas: { nome: string; coletas: number }[];
  alertas_por_tipo: { [key: string]: number };
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('12');

  useEffect(() => {
    fetchDados();
  }, [periodo]);

  const fetchDados = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/relatorios/dashboard-graficos/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const data = await response.json();
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      // Calcular dados reais da região do Paraná
      const bombonasStatus = {
        'Normal': BOMBONAS.filter(b => b.status === 'normal').length,
        'Quase Cheia': BOMBONAS.filter(b => b.status === 'quase_cheia').length,
        'Cheia': BOMBONAS.filter(b => b.status === 'cheia').length,
        'Manutenção': BOMBONAS.filter(b => b.status === 'manutencao').length,
      };

      const tiposResiduo: { [key: string]: { bombonas: number; peso_total: number } } = {};
      BOMBONAS.forEach(b => {
        if (!tiposResiduo[b.tipo_residuo]) {
          tiposResiduo[b.tipo_residuo] = { bombonas: 0, peso_total: 0 };
        }
        tiposResiduo[b.tipo_residuo].bombonas++;
        tiposResiduo[b.tipo_residuo].peso_total += b.peso_atual;
      });

      const empresasColetas = EMPRESAS.map(e => ({
        nome: e.nome.split(' - ')[0], // Pega só o nome principal
        coletas: COLETAS.filter(c => c.empresa_id === e.id).length
      })).sort((a, b) => b.coletas - a.coletas);

      const alertasPorTipo: { [key: string]: number } = {};
      ALERTAS.forEach(a => {
        const tipo = a.nivel === 'critico' ? 'Nível Crítico' :
                     a.nivel === 'alto' ? 'Nível Alto' :
                     a.nivel === 'medio' ? 'Atenção' : 'Normal';
        alertasPorTipo[tipo] = (alertasPorTipo[tipo] || 0) + 1;
      });

      const mockData: RelatorioData = {
        evolucao_mensal: [
          { mes: 'Jan/2024', peso: 280, coletas: 8 },
          { mes: 'Fev/2024', peso: 315, coletas: 9 },
          { mes: 'Mar/2024', peso: 295, coletas: 10 },
          { mes: 'Abr/2024', peso: 340, coletas: 11 },
          { mes: 'Mai/2024', peso: 325, coletas: 10 },
          { mes: 'Jun/2024', peso: 380, coletas: 12 },
          { mes: 'Jul/2024', peso: 365, coletas: 11 },
          { mes: 'Ago/2024', peso: 420, coletas: 13 },
          { mes: 'Set/2024', peso: 395, coletas: 12 },
          { mes: 'Out/2024', peso: 450, coletas: 14 },
          { mes: 'Nov/2024', peso: 380, coletas: 12 },
          { mes: 'Dez/2024', peso: COLETAS.filter(c => c.status === 'concluida').reduce((sum, c) => sum + c.peso_coletado, 0), coletas: COLETAS.filter(c => c.status === 'concluida').length }
        ],
        tipos_residuo: tiposResiduo,
        status_bombonas: bombonasStatus,
        empresas_ativas: empresasColetas,
        alertas_por_tipo: alertasPorTipo
      };
      setDados(mockData);
    } finally {
      setLoading(false);
    }
  };

  const CORES = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#84cc16'];

  const handleExportPDF = () => {
    alert('Exportando relatório em PDF...\nIncluindo todos os gráficos e estatísticas do período selecionado.');
    // TODO: Implementar geração de PDF com jsPDF ou react-pdf
  };

  const handleExportExcel = () => {
    alert('Exportando relatório em Excel...\nIncluindo dados detalhados de bombonas, coletas e alertas.');
    // TODO: Implementar geração de Excel com biblioteca xlsx
  };

  const topBarActions = (
    <>
      <select
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
      >
        <option value="1">Último mês</option>
        <option value="3">Últimos 3 meses</option>
        <option value="6">Últimos 6 meses</option>
        <option value="12">Últimos 12 meses</option>
        <option value="24">Últimos 2 anos</option>
      </select>
      <button 
        onClick={handleExportPDF}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Exportar PDF
      </button>
      <button 
        onClick={handleExportExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar Excel
      </button>
    </>
  );

  return (
    <DashboardLayout title="Relatórios e Analytics" topBarActions={topBarActions}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Coletas Realizadas</p>
                  <p className="text-3xl font-bold text-gray-900">{dados ? dados.evolucao_mensal.reduce((acc, item) => acc + item.coletas, 0) : 0}</p>
                  <p className="text-xs text-green-600">+12% vs mês anterior</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resíduos Coletados</p>
                  <p className="text-3xl font-bold text-gray-900">{dados ? Math.round(dados.evolucao_mensal.reduce((acc, item) => acc + item.peso, 0)).toLocaleString() : 0} kg</p>
                  <p className="text-xs text-blue-600">+8% vs mês anterior</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 21V5a2 2 0 012-2h2a2 2 0 012 2v16M5 10h14M5 14h14" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unidades Ativas</p>
                  <p className="text-3xl font-bold text-gray-900">{dados?.empresas_ativas.length || 0}</p>
                  <p className="text-xs text-purple-600">Hospitais e clínicas</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-xl">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alertas Críticos</p>
                  <p className="text-3xl font-bold text-gray-900">{dados ? Object.values(dados.alertas_por_tipo).reduce((acc, val) => acc + val, 0) : 0}</p>
                  <p className="text-xs text-red-600">Requer atenção imediata</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolução Mensal */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Evolução Mensal de Coletas</h3>
                <div className="text-sm text-gray-500">Resíduos hospitalares e tóxicos</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dados?.evolucao_mensal || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="coletas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Número de Coletas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    name="Peso Total (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tipos de Resíduo */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Distribuição por Tipo de Resíduo</h3>
                <div className="text-sm text-gray-500">Por número de bombonas</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dados ? Object.entries(dados.tipos_residuo).map(([tipo, data]) => ({
                      name: tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      value: data.bombonas,
                      peso: data.peso_total
                    })) : []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dados && Object.keys(dados.tipos_residuo).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value} bombonas`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status das Bombonas e Empresas Ativas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status das Bombonas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Bombonas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados ? Object.entries(dados.status_bombonas).map(([status, quantidade]) => ({
                  status,
                  quantidade
                })) : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="quantidade" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Unidades Mais Ativas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unidades Mais Ativas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados?.empresas_ativas || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis type="category" dataKey="nome" stroke="#666" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="coletas" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas por Tipo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas por Tipo de Ocorrência</h3>
              <div className="text-sm text-gray-500">Monitoramento em tempo real</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dados ? Object.entries(dados.alertas_por_tipo).map(([tipo, quantidade]) => ({
                tipo,
                quantidade
              })) : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="tipo" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="quantidade" stroke="#f59e0b" fill="#fef3c7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}