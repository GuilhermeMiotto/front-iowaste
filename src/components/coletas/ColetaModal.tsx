'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ColetaFormData {
  bombona: number;
  operador: string;
  data_coleta: string;
  peso_coletado: number;
  destino: string;
  empresa_destino: string;
  observacoes: string;
  numero_manifesto: string;
}

interface ColetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ColetaFormData) => Promise<void>;
  bombonas: Array<{ id: number; identificacao: string }>;
}

export default function ColetaModal({ isOpen, onClose, onSubmit, bombonas }: ColetaModalProps) {
  const [formData, setFormData] = useState<ColetaFormData>({
    bombona: 0,
    operador: '',
    data_coleta: new Date().toISOString().split('T')[0],
    peso_coletado: 0,
    destino: 'Incineração Hospitalar',
    empresa_destino: '',
    observacoes: '',
    numero_manifesto: `MTR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
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
      console.error('Erro ao criar coleta:', error);
      alert('Erro ao criar coleta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nova Coleta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bombona *
              </label>
              <select
                required
                value={formData.bombona}
                onChange={(e) => setFormData({ ...formData, bombona: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>Selecione...</option>
                {bombonas.map((b) => (
                  <option key={b.id} value={b.id}>{b.identificacao}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operador *
              </label>
              <input
                type="text"
                required
                value={formData.operador}
                onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Nome do operador"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Coleta *
              </label>
              <input
                type="date"
                required
                value={formData.data_coleta}
                onChange={(e) => setFormData({ ...formData, data_coleta: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso Coletado (kg) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.peso_coletado}
                onChange={(e) => setFormData({ ...formData, peso_coletado: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino *
              </label>
              <select
                required
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Incineração Hospitalar">Incineração Hospitalar</option>
                <option value="Tratamento Químico">Tratamento Químico</option>
                <option value="Aterro Classe I">Aterro Classe I</option>
                <option value="Reciclagem">Reciclagem</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa Destino *
              </label>
              <input
                type="text"
                required
                value={formData.empresa_destino}
                onChange={(e) => setFormData({ ...formData, empresa_destino: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número do Manifesto (MTR)
            </label>
            <input
              type="text"
              value={formData.numero_manifesto}
              onChange={(e) => setFormData({ ...formData, numero_manifesto: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Informações adicionais sobre a coleta"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-gray-400"
            >
              {loading ? 'Criando...' : 'Criar Coleta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
