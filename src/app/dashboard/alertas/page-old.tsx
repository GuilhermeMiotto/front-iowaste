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
  Circle
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
      baixo: 'bg-blue-100 text-blue-800 border-blue-300',
      medio: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      alto: 'bg-orange-100 text-orange-800 border-orange-300',
      critico: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[nivel as keyof typeof colors] || colors.medio;
  };

  const getNivelBadge = (nivel: string) => {
    const badges = {
      baixo: '🟢 Baixo',
      medio: '🟡 Médio',
      alto: '🟠 Alto',
      critico: '🔴 Crítico'
    };
    return badges[nivel as keyof typeof badges] || nivel;
  };

  const handleResolverAlerta = (alertaId: number) => {
    setAlertas(prev => prev.map(a => 
      a.id === alertaId 
        ? { ...a, resolvido: true, data_resolucao: new Date().toISOString() }
        : a
    ));
    alert('✅ Alerta resolvido com sucesso!');
  };

  const handleNotificarEquipe = (alerta: Alerta) => {
    const bombona = BOMBONAS.find(b => b.id === alerta.bombona_id);
    const empresa = EMPRESAS.find(e => e.id === bombona?.empresa_id);
    
    if (confirm(`📧 Notificar equipe sobre:\n\n${alerta.tipo} - ${getNivelBadge(alerta.nivel)}\n${alerta.descricao}\n\nLocal: ${empresa?.nome}\nBombona: ${bombona?.identificacao}\n\nDeseja enviar notificação?`)) {
      alert('✅ Notificação enviada para a equipe responsável!');
    }
  };

  const handleCriarAlerta = () => {
    if (!novoAlerta.descricao || !novoAlerta.bombona_id) {
      alert('❌ Preencha todos os campos obrigatórios');
      return;
    }

    const novoId = Math.max(...alertas.map(a => a.id)) + 1;
    const bombona = BOMBONAS.find(b => b.id === parseInt(novoAlerta.bombona_id));
    
    if (!bombona) {
      alert('❌ Bombona não encontrada');
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
    alert('✅ Alerta criado com sucesso!');
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
          <div className="text-xl">Carregando alertas...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Alertas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Alertas do Sistema</h1>
            <p className="text-gray-500 mt-1">Monitore e gerencie alertas em tempo real</p>
          </div>
          <Button 
            onClick={() => setShowNovoAlertaModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            🚨 Novo Alerta Manual
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="text-sm text-gray-600">Total de Alertas</div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
            <div className="text-sm text-gray-600">Não Resolvidos</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.naoResolvidos}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-red-200">
            <div className="text-sm text-gray-600">Críticos</div>
            <div className="text-3xl font-bold text-red-600">{stats.criticos}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="text-sm text-gray-600">Resolvidos</div>
            <div className="text-3xl font-bold text-green-600">{stats.resolvidos}</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="🔍 Buscar por descrição, tipo, bombona ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[300px]"
              />
              
              <select
                value={periodoFilter}
                onChange={(e) => setPeriodoFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">📅 Últimos 7 dias</option>
                <option value="30d">📅 Últimos 30 dias</option>
                <option value="3m">📅 Últimos 3 meses</option>
                <option value="6m">📅 Últimos 6 meses</option>
                <option value="todos">📅 Todos os períodos</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Status: Todos</option>
                <option value="nao_resolvido">❌ Não Resolvidos</option>
                <option value="resolvido">✅ Resolvidos</option>
              </select>

              <select
                value={nivelFilter}
                onChange={(e) => setNivelFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Nível: Todos</option>
                <option value="baixo">🟢 Baixo</option>
                <option value="medio">🟡 Médio</option>
                <option value="alto">🟠 Alto</option>
                <option value="critico">🔴 Crítico</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {alertasFiltrados.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 text-lg">
                {searchTerm || statusFilter !== 'todos' || nivelFilter !== 'todos'
                  ? '🔍 Nenhum alerta encontrado com os filtros aplicados'
                  : '✅ Nenhum alerta no momento'}
              </div>
            </Card>
          ) : (
            alertasFiltrados.map((alerta) => {
              const bombona = BOMBONAS.find(b => b.id === alerta.bombona_id);
              const empresa = EMPRESAS.find(e => e.id === (alerta.empresa_id || bombona?.empresa_id));
              
              return (
                <Card key={alerta.id} className={`p-6 border-l-4 ${getNivelColor(alerta.nivel)} transition-all hover:shadow-lg`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getNivelColor(alerta.nivel)}`}>
                          {getNivelBadge(alerta.nivel)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          alerta.resolvido 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {alerta.resolvido ? '✅ Resolvido' : '⚠️ Pendente'}
                        </span>
                        <span className="text-sm text-gray-500 uppercase font-medium">
                          {alerta.tipo.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{alerta.descricao}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">🏥 Empresa:</span> {alerta.empresa || empresa?.nome}
                        </div>
                        <div>
                          <span className="font-medium">🗑️ Bombona:</span> {alerta.bombona_identificacao || bombona?.identificacao}
                        </div>
                        <div>
                          <span className="font-medium">📍 Local:</span> {bombona?.localizacao || empresa?.cidade}
                        </div>
                        <div>
                          <span className="font-medium">📅 Data:</span> {new Date(alerta.data_alerta).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      {alerta.data_resolucao && (
                        <div className="mt-2 text-sm text-green-600">
                          ✅ Resolvido em: {new Date(alerta.data_resolucao).toLocaleDateString('pt-BR')} às {new Date(alerta.data_resolucao).toLocaleTimeString('pt-BR')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {!alerta.resolvido && (
                        <>
                          <Button
                            onClick={() => handleResolverAlerta(alerta.id)}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                          >
                            ✅ Resolver
                          </Button>
                          <Button
                            onClick={() => handleNotificarEquipe(alerta)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                          >
                            📧 Notificar Equipe
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {showNovoAlertaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🚨 Criar Novo Alerta</h2>
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="capacidade">📊 Capacidade</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="temperatura">🌡️ Temperatura</option>
                  <option value="vazamento">💧 Vazamento</option>
                  <option value="coleta_atrasada">⏰ Coleta Atrasada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nível de Prioridade</label>
                <select
                  value={novoAlerta.nivel}
                  onChange={(e) => setNovoAlerta({...novoAlerta, nivel: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baixo">🟢 Baixo</option>
                  <option value="medio">🟡 Médio</option>
                  <option value="alto">🟠 Alto</option>
                  <option value="critico">🔴 Crítico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bombona</label>
                <select
                  value={novoAlerta.bombona_id}
                  onChange={(e) => setNovoAlerta({...novoAlerta, bombona_id: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCriarAlerta}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg"
                >
                  🚨 Criar Alerta
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
