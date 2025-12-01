'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface BombonaFormData {
  identificacao: string;
  empresa: number;
  tipo_residuo: string;
  capacidade: number;
  endereco_instalacao: string;
  latitude: string;
  longitude: string;
}

interface BombonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BombonaFormData) => Promise<void>;
  initialData?: Partial<BombonaFormData>;
  empresas: Array<{ id: number; nome: string }>;
}

export default function BombonaModal({ isOpen, onClose, onSubmit, initialData, empresas }: BombonaModalProps) {
  const [formData, setFormData] = useState<BombonaFormData>({
    identificacao: initialData?.identificacao || '',
    empresa: initialData?.empresa || 0,
    tipo_residuo: initialData?.tipo_residuo || 'hospitalar_infectante',
    capacidade: initialData?.capacidade || 120,
    endereco_instalacao: initialData?.endereco_instalacao || '',
    latitude: initialData?.latitude || '-23.5505',
    longitude: initialData?.longitude || '-46.6333',
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar bombona:', error);
      alert('Erro ao salvar bombona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Editar Bombona' : 'Nova Bombona'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identificação *
              </label>
              <input
                type="text"
                required
                value={formData.identificacao}
                onChange={(e) => setFormData({ ...formData, identificacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="HOS-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Saúde *
              </label>
              <select
                required
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={0}>Selecione...</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Resíduo *
              </label>
              <select
                required
                value={formData.tipo_residuo}
                onChange={(e) => setFormData({ ...formData, tipo_residuo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="hospitalar_infectante">Hospitalar Infectante</option>
                <option value="hospitalar_quimico">Hospitalar Químico</option>
                <option value="hospitalar_perfurocortante">Perfurocortante</option>
                <option value="industrial_toxico">Industrial Tóxico</option>
                <option value="solventes_organicos">Solventes Orgânicos</option>
                <option value="metais_pesados">Metais Pesados</option>
                <option value="farmaceutico">Farmacêutico</option>
                <option value="outros_perigosos">Outros Perigosos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidade (kg) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Instalação *
            </label>
            <textarea
              required
              value={formData.endereco_instalacao}
              onChange={(e) => setFormData({ ...formData, endereco_instalacao: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Av. Paulista, 1000 - São Paulo, SP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="-23.5505"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="-46.6333"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Bombona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
