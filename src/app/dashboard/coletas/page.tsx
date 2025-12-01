'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Plus, Truck, CheckCircle2, Clock, XCircle, Package } from 'lucide-react';
import { COLETAS, Coleta } from '@/data/mockData';

interface Coleta {
  id: number;
  bombona_identificacao: string;
  empresa: string;
  operador: string;
  data_coleta: string;
  peso_coletado: number;
  destino: string;
  empresa_destino: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes: string;
  numero_manifesto: string;
  tipo_residuo: string;
}

export default function ColetasPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [coletas, setColetas] = useState<Coleta[]>(COLETAS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const fetchColetas = async () => {
    try {
      // Dados já carregados de mockData
      setColetas(COLETAS);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar coletas:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getTipoResiduoText = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'hospitalar_infectante': 'Hospitalar Infectante',
      'hospitalar_quimico': 'Hospitalar Químico',
      'hospitalar_perfurocortante': 'Perfurocortante',
      'industrial_toxico': 'Industrial Tóxico',
      'solventes_organicos': 'Solventes Orgânicos',
      'metais_pesados': 'Metais Pesados',
      'farmaceutico': 'Farmacêutico',
      'outros_perigosos': 'Outros Perigosos'
    };
    return tipos[tipo] || tipo;
  };

  const filteredColetas = coletas.filter((coleta) => {
    const matchesSearch = coleta.bombona_identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coleta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coleta.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coleta.numero_manifesto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || coleta.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return <div>Carregando...</div>;
  }

  const topBarActions = (
    <>
      <select
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="7">Últimos 7 dias</option>
        <option value="30">Últimos 30 dias</option>
        <option value="90">Últimos 90 dias</option>
        <option value="365">Último ano</option>
      </select>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Relatório MTR
      </button>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Nova Coleta
      </button>
    </>
  );

  return (
    <DashboardLayout title="Gestão de Coletas" topBarActions={topBarActions}>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por bombona, empresa, operador ou manifesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluídas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Coletas</p>
                <p className="text-2xl font-bold text-gray-900">{coletas.length}</p>
                <p className="text-xs text-blue-600">Período selecionado</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{coletas.filter(c => c.status === 'pendente').length}</p>
                <p className="text-xs text-yellow-600">Aguardando execução</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">{coletas.filter(c => c.status === 'concluida').length}</p>
                <p className="text-xs text-green-600">Processadas com sucesso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coletado</p>
                <p className="text-2xl font-bold text-gray-900">{coletas.reduce((acc, c) => acc + c.peso_coletado, 0)}</p>
                <p className="text-xs text-purple-600">kg de resíduos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coletas Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Coletas de Resíduos</h3>
            <p className="text-sm text-gray-500 mt-1">Registro de coletas de resíduos hospitalares e tóxicos</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando coletas...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coleta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade de Saúde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Resíduo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredColetas.map((coleta) => (
                    <tr key={coleta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{coleta.bombona_identificacao}</div>
                          <div className="text-sm text-gray-500">{coleta.numero_manifesto}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coleta.empresa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getTipoResiduoText(coleta.tipo_residuo)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coleta.operador}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(coleta.data_coleta).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(coleta.data_coleta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {coleta.peso_coletado} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coleta.status)}`}>
                          {getStatusText(coleta.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coleta.destino}</div>
                        <div className="text-sm text-gray-500">{coleta.empresa_destino}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Ver detalhes">
                            👁️
                          </button>
                          <button className="text-green-600 hover:text-green-900 transition-colors" title="MTR">
                            📄
                          </button>
                          {coleta.status === 'pendente' && (
                            <>
                              <button className="text-yellow-600 hover:text-yellow-900 transition-colors" title="Editar">
                                ✏️
                              </button>
                              <button className="text-red-600 hover:text-red-900 transition-colors" title="Cancelar">
                                ❌
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredColetas.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma coleta encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou termos de busca.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}