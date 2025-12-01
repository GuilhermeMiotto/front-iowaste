'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Download, Building2, CheckCircle2, Package, BarChart3 } from 'lucide-react';
import { EMPRESAS, Empresa } from '@/data/mockData';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  responsavel: string;
  bombonas_count: number;
  is_active: boolean;
}

export default function EmpresasPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const fetchEmpresas = async () => {
    try {
      // Dados já carregados de mockData
      setEmpresas(EMPRESAS);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setLoading(false);
    }
  };
  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    empresa.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div>Carregando...</div>;
  }

  const topBarActions = (
    <>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exportar Excel
      </button>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Nova Unidade
      </button>
    </>
  );

  return (
    <DashboardLayout title="Unidades de Saúde" topBarActions={topBarActions}>
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por hospital, clínica, CNPJ ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Todos os tipos</option>
              <option value="hospital">Hospitais</option>
              <option value="clinica">Clínicas</option>
              <option value="laboratorio">Laboratórios</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Unidades</p>
                <p className="text-2xl font-bold text-gray-900">{empresas.length}</p>
                <p className="text-xs text-green-600">Hospitais e clínicas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unidades Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{empresas.filter(e => e.is_active).length}</p>
                <p className="text-xs text-blue-600">Em operação</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Bombonas</p>
                <p className="text-2xl font-bold text-gray-900">{empresas.reduce((acc, e) => acc + e.bombonas_count, 0)}</p>
                <p className="text-xs text-yellow-600">Para resíduos hospitalares</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média por Unidade</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(empresas.reduce((acc, e) => acc + e.bombonas_count, 0) / empresas.length || 0)}</p>
                <p className="text-xs text-purple-600">Bombonas/unidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Unidades de Saúde</h3>
            <p className="text-sm text-gray-500 mt-1">Hospitais, clínicas e laboratórios cadastrados no sistema</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando unidades...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade de Saúde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CNPJ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bombonas
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
                  {filteredEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{empresa.nome}</div>
                          <div className="text-sm text-gray-500">{empresa.responsavel}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa.cnpj}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{empresa.email}</div>
                        <div className="text-sm text-gray-500">{empresa.telefone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{empresa.cidade}, {empresa.estado}</div>
                        <div className="text-sm text-gray-500">{empresa.endereco}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {empresa.bombonas_count} bombonas
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          empresa.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {empresa.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="text-green-600 hover:text-green-900 transition-colors" title="Editar">
                            ✏️
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Ver detalhes">
                            👁️
                          </button>
                          <button className="text-purple-600 hover:text-purple-900 transition-colors" title="Ver bombonas">
                            🗂️
                          </button>
                          <button className="text-red-600 hover:text-red-900 transition-colors" title="Desativar">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEmpresas.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma unidade encontrada</h3>
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