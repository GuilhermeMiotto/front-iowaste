'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapaInterativo from '@/components/maps/MapaInterativo';
import { Target, Download, Map, AlertTriangle, Clock, CheckCircle2, BarChart3, MapPin, Truck } from 'lucide-react';
import { BOMBONAS, Bombona } from '@/data/mockData';

export default function MapaPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bombonas, setBombonas] = useState<Bombona[]>(BOMBONAS);
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const fetchBombonas = async () => {
    try {
      // Dados já carregados de mockData
      setBombonas(BOMBONAS);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar bombonas:', error);
      setLoading(false);
    }
  };

  const bombonasFiltradas = bombonas.filter((bombona) => {
    const matchesStatus = filtroStatus === 'todos' || bombona.status === filtroStatus;
    const matchesTipo = filtroTipo === 'todos' || bombona.tipo_residuo === filtroTipo;
    return matchesStatus && matchesTipo;
  });

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

  if (!user) {
    return <div>Carregando...</div>;
  }

  const topBarActions = (
    <>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <Target className="w-4 h-4" />
        Centrar Mapa
      </button>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exportar KML
      </button>
    </>
  );

  return (
    <DashboardLayout title="Mapa de Bombonas" topBarActions={topBarActions}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os status</option>
                <option value="normal">Normal</option>
                <option value="quase_cheia">Quase Cheia</option>
                <option value="cheia">Cheia</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os tipos</option>
                <option value="hospitalar_infectante">Hospitalar Infectante</option>
                <option value="hospitalar_quimico">Hospitalar Químico</option>
                <option value="hospitalar_perfurocortante">Perfurocortante</option>
                <option value="industrial_toxico">Industrial Tóxico</option>
                <option value="farmaceutico">Farmacêutico</option>
                <option value="outros_perigosos">Outros Perigosos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bombonas Mapeadas</p>
                <p className="text-2xl font-bold text-gray-900">{bombonasFiltradas.length}</p>
                <p className="text-xs text-blue-600">Unidades de saúde</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status Crítico</p>
                <p className="text-2xl font-bold text-gray-900">{bombonasFiltradas.filter(b => b.status === 'cheia').length}</p>
                <p className="text-xs text-red-600">Necessitam coleta</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quase Cheias</p>
                <p className="text-2xl font-bold text-gray-900">{bombonasFiltradas.filter(b => b.status === 'quase_cheia').length}</p>
                <p className="text-xs text-yellow-600">Atenção necessária</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status Normal</p>
                <p className="text-2xl font-bold text-gray-900">{bombonasFiltradas.filter(b => b.status === 'normal').length}</p>
                <p className="text-xs text-green-600">Operacionais</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Localização das Bombonas</h3>
                <p className="text-sm text-gray-500 mt-1">Visualização em tempo real das bombonas em unidades de saúde</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Quase Cheia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Cheia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span>Manutenção</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="ml-3 text-gray-500">Carregando mapa...</p>
              </div>
            ) : (
              <div style={{ height: '600px' }}>
                <MapaInterativo bombonas={bombonasFiltradas} />
              </div>
            )}
          </div>
        </div>

        {/* Legend and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Legenda dos Tipos de Resíduo</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm">Hospitalar Infectante - Material contaminado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm">Hospitalar Químico - Produtos químicos</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                <span className="text-sm">Perfurocortante - Agulhas e lâminas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-black rounded mr-3"></div>
                <span className="text-sm">Industrial Tóxico - Resíduos industriais</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm">Farmacêutico - Medicamentos</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm">Outros Perigosos - Diversos</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h4>
            <div className="space-y-3">
              <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 p-3 rounded-lg text-left transition-colors flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Bombonas que necessitam coleta urgente
              </button>
              <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-3 rounded-lg text-left transition-colors flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Relatório de ocupação por região
              </button>
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-left transition-colors flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Otimizar rota de coleta
              </button>
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-left transition-colors flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adicionar nova bombona
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}