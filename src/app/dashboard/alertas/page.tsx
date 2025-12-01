'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ALERTAS, BOMBONAS, EMPRESAS } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Building2, 
  Package, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Search,
  Bell,
  AlertCircle,
  Circle,
  Activity
} from 'lucide-react';

type Alerta = typeof ALERTAS[0];

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'nao_resolvido' | 'resolvido'>('todos');
  const [nivelFilter, setNivelFilter] = useState<'todos' | 'baixo' | 'medio' | 'alto' | 'critico'>('todos');
  const [periodoFilter, setPeriodoFilter] = useState<'7d' | '30d' | '3m' | '6m' | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovoAlertaModal, setShowNovoAlertaModal] = useState(false);
  const [novoAlerta, setNovoAlerta] = useState({
    tipo: 'capacidade',
    nivel: 'medio',
    descricao: '',
    bombona_id: ''
  });

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      setAlertas(ALERTAS);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      setLoading(false);
    }
  };

  const getNivelColor = (nivel: string) => {
    const colors = {
      baixo: 'border-blue-500 bg-blue-50',
      medio: 'border-yellow-500 bg-yellow-50',
      alto: 'border-orange-500 bg-orange-50',
      critico: 'border-red-500 bg-red-50'
    };
    return colors[nivel as keyof typeof colors] || colors.medio;
  };

  const getNivelIcon = (nivel: string) => {
    const icons = {
      baixo: <Circle className="w-5 h-5 text-blue-600" fill="currentColor" />,
      medio: <Circle className="w-5 h-5 text-yellow-600" fill="currentColor" />,
      alto: <Circle className="w-5 h-5 text-orange-600" fill="currentColor" />,
      critico: <Circle className="w-5 h-5 text-red-600" fill="currentColor" />
    };
    return icons[nivel as keyof typeof icons] || icons.medio;
  };

  const getNivelText = (nivel: string) => {
    const labels = {
      baixo: 'Baixo',
      medio: 'Médio',
      alto: 'Alto',
      critico: 'Crítico'
    };
    return labels[nivel as keyof typeof labels] || nivel;
  };

  const handleResolverAlerta = (alertaId: number) => {
    setAlertas(prev => prev.map(a => 
      a.id === alertaId 
        ? { ...a, resolvido: true, data_resolucao: new Date().toISOString() }
        : a
    ));
  };

  const handleNotificarEquipe = (alerta: Alerta) => {
    const bombona = BOMBONAS.find(b => b.id === alerta.bombona_id);
    const empresa = EMPRESAS.find(e => e.id === (alerta.empresa_id || bombona?.empresa_id));
    
    if (confirm(`Notificar equipe sobre:\n\n${alerta.tipo} - ${getNivelText(alerta.nivel)}\n${alerta.descricao}\n\nLocal: ${empresa?.nome}\nBombona: ${bombona?.identificacao}\n\nDeseja enviar notificação?`)) {
      // Simulação de notificação enviada
    }
  };

  const handleCriarAlerta = () => {
    if (!novoAlerta.descricao || !novoAlerta.bombona_id) {
      return;
    }

    const novoId = Math.max(...alertas.map(a => a.id)) + 1;
    const bombona = BOMBONAS.find(b => b.id === parseInt(novoAlerta.bombona_id));
    
    if (!bombona) {
      return;
    }

    const empresa = EMPRESAS.find(e => e.id === bombona.empresa_id);

    const alertaCriado: Alerta = {
      id: novoId,
      bombona_id: bombona.id,
      bombona_identificacao: bombona.identificacao,
      empresa_id: bombona.empresa_id,
      empresa: empresa?.nome || '',
      tipo: novoAlerta.tipo as any,
      nivel: novoAlerta.nivel as any,
      descricao: novoAlerta.descricao,
      data_alerta: new Date().toISOString(),
      resolvido: false,
      tipo_residuo: bombona.tipo_residuo
    };

    setAlertas(prev => [alertaCriado, ...prev]);
    setShowNovoAlertaModal(false);
    setNovoAlerta({ tipo: 'capacidade', nivel: 'medio', descricao: '', bombona_id: '' });
  };

  const getDataLimite = () => {
    const hoje = new Date();
    switch (periodoFilter) {
      case '7d': return new Date(hoje.setDate(hoje.getDate() - 7));
      case '30d': return new Date(hoje.setDate(hoje.getDate() - 30));
      case '3m': return new Date(hoje.setMonth(hoje.getMonth() - 3));
      case '6m': return new Date(hoje.setMonth(hoje.getMonth() - 6));
      default: return new Date(0);
    }
  };

  const alertasFiltrados = alertas
    .filter(a => {
      if (statusFilter === 'todos') return true;
      if (statusFilter === 'nao_resolvido') return !a.resolvido;
      if (statusFilter === 'resolvido') return a.resolvido;
      return true;
    })
    .filter(a => nivelFilter === 'todos' || a.nivel === nivelFilter)
    .filter(a => {
      if (periodoFilter === 'todos') return true;
      const dataAlerta = new Date(a.data_alerta);
      return dataAlerta >= getDataLimite();
    })
    .filter(a => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        a.descricao.toLowerCase().includes(searchLower) ||
        a.tipo.toLowerCase().includes(searchLower) ||
        a.bombona_identificacao?.toLowerCase().includes(searchLower) ||
        a.empresa?.toLowerCase().includes(searchLower)
      );
    });

  const stats = {
    total: alertasFiltrados.length,
    naoResolvidos: alertasFiltrados.filter(a => !a.resolvido).length,
    criticos: alertasFiltrados.filter(a => a.nivel === 'critico').length,
    resolvidos: alertasFiltrados.filter(a => a.resolvido).length
  };

  if (loading) {
    return (
      <DashboardLayout title="Alertas">
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Alertas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alertas do Sistema</h1>
            <p className="text-gray-600 mt-1">Monitore e gerencie alertas em tempo real</p>
          </div>
          <Button 
            onClick={() => setShowNovoAlertaModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Novo Alerta Manual
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alertas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Resolvidos</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.naoResolvidos}</p>
              </div>
              <XCircle className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticos}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvidos}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por descrição, tipo, bombona ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={periodoFilter}
              onChange={(e) => setPeriodoFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="todos">Todos os períodos</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="todos">Status: Todos</option>
              <option value="nao_resolvido">Não Resolvidos</option>
              <option value="resolvido">Resolvidos</option>
            </select>

            <select
              value={nivelFilter}
              onChange={(e) => setNivelFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="todos">Nível: Todos</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {alertasFiltrados.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || statusFilter !== 'todos' || nivelFilter !== 'todos'
                  ? 'Nenhum alerta encontrado com os filtros aplicados'
                  : 'Nenhum alerta no momento'}
              </p>
            </Card>
          ) : (
            alertasFiltrados.map((alerta) => {
              const bombona = BOMBONAS.find(b => b.id === alerta.bombona_id);
              const empresa = EMPRESAS.find(e => e.id === (alerta.empresa_id || bombona?.empresa_id));
              
              return (
                <Card 
                  key={alerta.id} 
                  className={`p-6 border-l-4 ${getNivelColor(alerta.nivel)} transition-all hover:shadow-lg`}
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border">
                          {getNivelIcon(alerta.nivel)}
                          <span className="text-sm font-semibold">{getNivelText(alerta.nivel)}</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          alerta.resolvido 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {alerta.resolvido ? (
                            <><CheckCircle className="w-4 h-4" /> Resolvido</>
                          ) : (
                            <><XCircle className="w-4 h-4" /> Pendente</>
                          )}
                        </div>
                        
                        <span className="text-sm text-gray-500 font-medium uppercase">
                          {alerta.tipo.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{alerta.descricao}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{alerta.empresa || empresa?.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>{alerta.bombona_identificacao || bombona?.identificacao}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{bombona?.localizacao || empresa?.cidade}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(alerta.data_alerta).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      {alerta.data_resolucao && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            Resolvido em: {new Date(alerta.data_resolucao).toLocaleDateString('pt-BR')} às {new Date(alerta.data_resolucao).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {!alerta.resolvido && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleResolverAlerta(alerta.id)}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolver
                        </Button>
                        <Button
                          onClick={() => handleNotificarEquipe(alerta)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
                        >
                          <Bell className="w-4 h-4" />
                          Notificar
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Novo Alerta */}
      {showNovoAlertaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold">Criar Novo Alerta</h2>
              </div>
              <button
                onClick={() => setShowNovoAlertaModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Alerta</label>
                <select
                  value={novoAlerta.tipo}
                  onChange={(e) => setNovoAlerta({...novoAlerta, tipo: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="capacidade">Capacidade</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="temperatura">Temperatura</option>
                  <option value="vazamento">Vazamento</option>
                  <option value="coleta_atrasada">Coleta Atrasada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nível de Prioridade</label>
                <select
                  value={novoAlerta.nivel}
                  onChange={(e) => setNovoAlerta({...novoAlerta, nivel: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="baixo">Baixo</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                  <option value="critico">Crítico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bombona</label>
                <select
                  value={novoAlerta.bombona_id}
                  onChange={(e) => setNovoAlerta({...novoAlerta, bombona_id: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione uma bombona...</option>
                  {BOMBONAS.map(b => {
                    const emp = EMPRESAS.find(e => e.id === b.empresa_id);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.identificacao} - {emp?.nome} ({b.localizacao})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição do Alerta</label>
                <textarea
                  value={novoAlerta.descricao}
                  onChange={(e) => setNovoAlerta({...novoAlerta, descricao: e.target.value})}
                  placeholder="Descreva o alerta em detalhes..."
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCriarAlerta}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center gap-2 justify-center"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Criar Alerta
                </Button>
                <Button
                  onClick={() => setShowNovoAlertaModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
