'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { 
  FileText, 
  RefreshCw, 
  Building2, 
  Package, 
  AlertTriangle, 
  Truck,
  Scale,
  Map,
  PackageOpen,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { BOMBONAS, ALERTAS, COLETAS, EMPRESAS } from '@/data/mockData';

interface DashboardStats {
  unidades_saude: number;
  bombonas: number;
  alertas_criticos: number;
  coletas_mes: number;
  peso_total_mes: number;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Calcular estatísticas dos dados reais
  const alertasCriticos = ALERTAS.filter(a => !a.resolvido && (a.nivel === 'critico' || a.nivel === 'alto')).length;
  const coletasMes = COLETAS.filter(c => c.status === 'concluida').length;
  const pesoTotalMes = COLETAS.filter(c => c.status === 'concluida').reduce((sum, c) => sum + c.peso_coletado, 0);
  
  const [stats] = useState<DashboardStats>({
    unidades_saude: EMPRESAS.length,
    bombonas: BOMBONAS.length,
    alertas_criticos: alertasCriticos,
    coletas_mes: coletasMes,
    peso_total_mes: pesoTotalMes
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const topBarActions = (
    <>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Relatório Mensal
      </button>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Atualizar Dados
      </button>
    </>
  );

  return (
    <DashboardLayout title="Dashboard - Sistema IoWaste" topBarActions={topBarActions}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Bem-vindo, {user.first_name}!</h2>
              <p className="text-green-100 mt-1">Sistema de Gestão de Resíduos Hospitalares e Tóxicos</p>
            </div>
            <Building2 className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unidades de Saúde</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unidades_saude}</p>
                <p className="text-xs text-blue-600">Hospitais e clínicas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bombonas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bombonas}</p>
                <p className="text-xs text-green-600">Monitoradas 24/7</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas Críticos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.alertas_criticos}</p>
                <p className="text-xs text-red-600">Ação necessária</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <PackageOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coletas (Mês)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.coletas_mes}</p>
                <p className="text-xs text-purple-600">Realizadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Scale className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Peso Total (Mês)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.peso_total_mes}</p>
                <p className="text-xs text-yellow-600">kg de resíduos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Acesso Rápido</h3>
            <p className="text-sm text-gray-500 mt-1">Navegue pelas principais funcionalidades do sistema</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/dashboard/empresas" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-blue-700">Unidades</div>
                <div className="text-xs text-blue-500 mt-1">Hospitais e clínicas</div>
              </Link>
              <Link href="/dashboard/bombonas" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <Package className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-sm font-medium text-green-700">Bombonas</div>
                <div className="text-xs text-green-500 mt-1">Resíduos hospitalares</div>
              </Link>
              <Link href="/dashboard/mapa" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <Map className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-sm font-medium text-purple-700">Mapa</div>
                <div className="text-xs text-purple-500 mt-1">Localização real</div>
              </Link>
              <Link href="/dashboard/alertas" className="bg-red-50 hover:bg-red-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-sm font-medium text-red-700">Alertas</div>
                <div className="text-xs text-red-500 mt-1">Monitoramento</div>
              </Link>
              <Link href="/dashboard/coletas" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <PackageOpen className="w-8 h-8 text-yellow-600 mb-2" />
                <div className="text-sm font-medium text-yellow-700">Coletas</div>
                <div className="text-xs text-yellow-500 mt-1">Histórico e MTR</div>
              </Link>
              <Link href="/dashboard/relatorios" className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition-colors text-center flex flex-col items-center">
                <BarChart3 className="w-8 h-8 text-indigo-600 mb-2" />
                <div className="text-sm font-medium text-indigo-700">Relatórios</div>
                <div className="text-xs text-indigo-500 mt-1">Analytics</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">Alertas Recentes</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Bombona HOS-001 lotada (95%)</p>
                  <p className="text-xs text-gray-500">Hospital das Clínicas - Resíduos infectantes</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-red-600" />
                    <p className="text-xs text-red-600 font-medium">Há 15 minutos</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Temperatura elevada IND-001</p>
                  <p className="text-xs text-gray-500">Instituto do Câncer - Resíduos tóxicos</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-yellow-600" />
                    <p className="text-xs text-yellow-600 font-medium">Há 32 minutos</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sensor offline MET-001</p>
                  <p className="text-xs text-gray-500">Santa Casa - Metais pesados</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <p className="text-xs text-blue-600 font-medium">Há 1 hora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Atividades Recentes</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Coleta HOS-002 concluída</p>
                  <p className="text-xs text-gray-500">45kg de resíduos químicos coletados</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">Há 2 horas</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nova bombona FAR-002 instalada</p>
                  <p className="text-xs text-gray-500">Hospital Israelita - Resíduos farmacêuticos</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-purple-600" />
                    <p className="text-xs text-purple-600 font-medium">Há 4 horas</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Relatório mensal gerado</p>
                  <p className="text-xs text-gray-500">Disponível para download na seção de relatórios</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <p className="text-xs text-indigo-600 font-medium">Hoje</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema IoWaste</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Sistema Online</div>
              <div className="text-xs text-gray-500">Todos os serviços operacionais</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">IoT Conectado</div>
              <div className="text-xs text-gray-500">68 sensores ativos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <RefreshCw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Sincronização</div>
              <div className="text-xs text-gray-500">Última: há 2 minutos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Building2 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Unidades Ativas</div>
              <div className="text-xs text-gray-500">8 hospitais conectados</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}