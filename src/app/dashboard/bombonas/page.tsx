'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, Plus, MapPin, CheckCircle2, AlertTriangle, Wrench, XCircle } from 'lucide-react';
import { BOMBONAS, EMPRESAS, getTipoResiduoText, Bombona } from '@/data/mockData';
import BombonaModal from '@/components/bombonas/BombonaModal';

export default function BombonasPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bombonas, setBombonas] = useState<Bombona[]>(BOMBONAS);
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBombona, setSelectedBombona] = useState<Bombona | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const filteredBombonas = bombonas.filter((bombona) => {
    const matchesFilter = filter === 'todas' || bombona.status === filter;
    const matchesSearch = 
      bombona.identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bombona.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bombona.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bombona.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'quase_cheia':
        return 'bg-yellow-100 text-yellow-800';
      case 'cheia':
        return 'bg-red-100 text-red-800';
      case 'manutencao':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'quase_cheia':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cheia':
        return <XCircle className="w-4 h-4" />;
      case 'manutencao':
        return <Wrench className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'quase_cheia':
        return 'Quase Cheia';
      case 'cheia':
        return 'Cheia';
      case 'manutencao':
        return 'Manutenção';
      default:
        return status;
    }
  };

  const handleNewBombona = () => {
    setSelectedBombona(undefined);
    setIsModalOpen(true);
  };

  const handleEditBombona = (bombona: Bombona) => {
    setSelectedBombona(bombona);
    setIsModalOpen(true);
  };

  const handleSaveBombona = async (bombonaData: any) => {
    if (selectedBombona) {
      // Editar existente
      setBombonas(bombonas.map(b => 
        b.id === selectedBombona.id ? { ...b, ...bombonaData } : b
      ));
    } else {
      // Criar nova
      const empresa = EMPRESAS.find(e => e.id === bombonaData.empresa);
      const newBombona: Bombona = {
        id: Math.max(...bombonas.map(b => b.id)) + 1,
        identificacao: bombonaData.identificacao,
        empresa_id: bombonaData.empresa,
        empresa: empresa?.nome || '',
        tipo_residuo: bombonaData.tipo_residuo,
        capacidade: bombonaData.capacidade,
        peso_atual: 0,
        percentual_ocupacao: 0,
        status: 'normal',
        localizacao: bombonaData.endereco_instalacao,
        endereco: empresa?.endereco || '',
        cidade: empresa?.cidade || '',
        latitude: parseFloat(bombonaData.latitude),
        longitude: parseFloat(bombonaData.longitude),
        ultima_coleta: new Date().toISOString().split('T')[0],
        proxima_coleta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperatura: 22.0,
      };
      setBombonas([...bombonas, newBombona]);
    }
    setIsModalOpen(false);
  };

  const handleExportarExcel = () => {
    alert('Exportando para Excel... (funcionalidade será implementada)');
  };

  const stats = {
    total: bombonas.length,
    normal: bombonas.filter(b => b.status === 'normal').length,
    quase_cheia: bombonas.filter(b => b.status === 'quase_cheia').length,
    cheia: bombonas.filter(b => b.status === 'cheia').length,
    manutencao: bombonas.filter(b => b.status === 'manutencao').length,
  };

  const topBarActions = (
    <>
      <button 
        onClick={handleExportarExcel}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar Excel
      </button>
      <button 
        onClick={handleNewBombona}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Nova Bombona
      </button>
    </>
  );

  return (
    <DashboardLayout title="Bombonas IoT" topBarActions={topBarActions}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal</p>
              <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quase Cheia</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.quase_cheia}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cheia</p>
              <p className="text-2xl font-bold text-red-600">{stats.cheia}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Manutenção</p>
              <p className="text-2xl font-bold text-gray-600">{stats.manutencao}</p>
            </div>
            <Wrench className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por identificação, empresa, localização ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('todas')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'todas' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'normal' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFilter('quase_cheia')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'quase_cheia' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alerta
            </button>
            <button
              onClick={() => setFilter('cheia')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'cheia' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Crítico
            </button>
          </div>
        </div>
      </div>

      {/* Bombonas List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identificação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidade de Saúde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBombonas.map((bombona) => (
                <tr key={bombona.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bombona.identificacao}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{bombona.empresa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {bombona.localizacao}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bombona.cidade}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {getTipoResiduoText(bombona.tipo_residuo)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            {bombona.peso_atual}kg / {bombona.capacidade}kg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                bombona.percentual_ocupacao >= 90
                                  ? 'bg-red-500'
                                  : bombona.percentual_ocupacao >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${bombona.percentual_ocupacao}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {bombona.percentual_ocupacao}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bombona.status)}`}>
                      {getStatusIcon(bombona.status)}
                      {getStatusText(bombona.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditBombona(bombona)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Editar
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBombonas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma bombona encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BombonaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveBombona}
          initialData={selectedBombona ? {
            identificacao: selectedBombona.identificacao,
            empresa: selectedBombona.empresa_id,
            tipo_residuo: selectedBombona.tipo_residuo,
            capacidade: selectedBombona.capacidade,
            endereco_instalacao: selectedBombona.localizacao,
            latitude: selectedBombona.latitude.toString(),
            longitude: selectedBombona.longitude.toString(),
          } : undefined}
          empresas={EMPRESAS}
        />
      )}
    </DashboardLayout>
  );
}
