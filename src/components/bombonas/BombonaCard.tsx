/**
 * BombonaCard - Componente unificado para exibição de bombonas
 * Suporta múltiplos variantes: full, compact, mini
 */

import { Package, MapPin, Thermometer, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { colors } from '@/tokens/colors';

export interface BombonaData {
  id: number;
  identificacao: string;
  empresa: string;
  tipo_residuo: string;
  capacidade: number;
  peso_atual: number;
  percentual_ocupacao: number;
  status: 'vazia' | 'normal' | 'alerta' | 'cheia' | 'critica';
  localizacao?: string;
  ultima_coleta?: string;
  proxima_coleta?: string;
  temperatura?: number;
}

interface BombonaCardProps {
  bombona: BombonaData;
  variant?: 'full' | 'compact' | 'mini';
  onViewDetails?: (id: number) => void;
  onShowLocation?: (id: number) => void;
  onMaintenance?: (id: number) => void;
}

const getTipoResiduoText = (tipo: string): string => {
  const tipos: Record<string, string> = {
    hospitalar_infectante: 'Infectante',
    hospitalar_quimico: 'Químico',
    hospitalar_perfurocortante: 'Perfurocortante',
    industrial_toxico: 'Industrial Tóxico',
    solventes_organicos: 'Solventes Orgânicos',
    metais_pesados: 'Metais Pesados',
    farmaceutico: 'Farmacêutico',
    outros_perigosos: 'Outros Perigosos',
  };
  return tipos[tipo] || tipo;
};

const getTipoResiduoColor = (tipo: string): string => {
  const colorMap: Record<string, string> = {
    hospitalar_infectante: 'bg-red-100 text-red-800',
    hospitalar_quimico: 'bg-yellow-100 text-yellow-800',
    hospitalar_perfurocortante: 'bg-orange-100 text-orange-800',
    industrial_toxico: 'bg-red-100 text-red-900',
    solventes_organicos: 'bg-amber-100 text-amber-800',
    metais_pesados: 'bg-gray-100 text-gray-800',
    farmaceutico: 'bg-blue-100 text-blue-800',
    outros_perigosos: 'bg-yellow-100 text-yellow-800',
  };
  return colorMap[tipo] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    vazia: 'bg-gray-100 text-gray-700',
    normal: 'bg-green-100 text-green-700',
    alerta: 'bg-yellow-100 text-yellow-700',
    cheia: 'bg-red-100 text-red-700',
    critica: 'bg-red-200 text-red-900',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700';
};

const getStatusText = (status: string): string => {
  const statusText: Record<string, string> = {
    vazia: 'Vazia',
    normal: 'Normal',
    alerta: 'Atenção',
    cheia: 'Cheia',
    critica: 'Crítico',
  };
  return statusText[status] || status;
};

const getStatusIcon = (status: string) => {
  const iconProps = { className: 'w-4 h-4' };
  
  switch (status) {
    case 'vazia':
      return <CheckCircle2 {...iconProps} />;
    case 'normal':
      return <CheckCircle2 {...iconProps} />;
    case 'alerta':
      return <AlertTriangle {...iconProps} />;
    case 'cheia':
      return <AlertTriangle {...iconProps} />;
    case 'critica':
      return <AlertTriangle {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
};

const getProgressBarColor = (percentual: number): string => {
  if (percentual >= 90) return 'bg-red-500';
  if (percentual >= 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function BombonaCard({
  bombona,
  variant = 'full',
  onViewDetails,
  onShowLocation,
  onMaintenance,
}: BombonaCardProps) {
  
  // Variant: Mini (usado em listas compactas, mapas)
  if (variant === 'mini') {
    return (
      <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-600" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">{bombona.identificacao}</h4>
              <p className="text-xs text-gray-500">{bombona.empresa}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bombona.status)}`}>
            {getStatusText(bombona.status)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressBarColor(bombona.percentual_ocupacao)}`}
            style={{ width: `${bombona.percentual_ocupacao}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">{bombona.percentual_ocupacao}% ocupado</p>
      </div>
    );
  }
  
  // Variant: Compact (usado em grids)
  if (variant === 'compact') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{bombona.identificacao}</h4>
              <p className="text-sm text-gray-500">{bombona.empresa}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bombona.status)}`}>
            {getStatusText(bombona.status)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tipo:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTipoResiduoColor(bombona.tipo_residuo)}`}>
              {getTipoResiduoText(bombona.tipo_residuo)}
            </span>
          </div>
          {bombona.localizacao && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Localização:</span>
              <span className="font-medium">{bombona.localizacao}</span>
            </div>
          )}
          {bombona.temperatura && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Temperatura:</span>
              <span className="font-medium">{bombona.temperatura}°C</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Ocupação</span>
            <span className="font-medium">{bombona.percentual_ocupacao}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressBarColor(bombona.percentual_ocupacao)}`}
              style={{ width: `${bombona.percentual_ocupacao}%` }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2">
          {onViewDetails && (
            <button 
              onClick={() => onViewDetails(bombona.id)}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Ver Detalhes
            </button>
          )}
          {onShowLocation && (
            <button 
              onClick={() => onShowLocation(bombona.id)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
          {onMaintenance && (
            <button 
              onClick={() => onMaintenance(bombona.id)}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant: Full (padrão, com todas as informações)
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-xl">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{bombona.identificacao}</h3>
            <p className="text-sm text-gray-600">{bombona.empresa}</p>
            {bombona.localizacao && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">{bombona.localizacao}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(bombona.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bombona.status)}`}>
            {getStatusText(bombona.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Tipo de Resíduo</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTipoResiduoColor(bombona.tipo_residuo)}`}>
            {getTipoResiduoText(bombona.tipo_residuo)}
          </span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Capacidade</p>
          <p className="text-sm font-bold text-gray-900">{bombona.capacidade} kg</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Peso Atual</p>
          <p className="text-sm font-bold text-gray-900">{bombona.peso_atual} kg</p>
        </div>
        
        {bombona.temperatura && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Thermometer className="w-3 h-3 text-gray-600" />
              <p className="text-xs text-gray-600">Temperatura</p>
            </div>
            <p className="text-sm font-bold text-gray-900">{bombona.temperatura}°C</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">Nível de Ocupação</span>
          <span className="font-bold text-gray-900">{bombona.percentual_ocupacao}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getProgressBarColor(bombona.percentual_ocupacao)} transition-all`}
            style={{ width: `${bombona.percentual_ocupacao}%` }}
          ></div>
        </div>
      </div>

      {/* Collection Info */}
      {(bombona.ultima_coleta || bombona.proxima_coleta) && (
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
          {bombona.ultima_coleta && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Última Coleta</p>
              <p className="text-sm font-medium text-gray-900">{bombona.ultima_coleta}</p>
            </div>
          )}
          {bombona.proxima_coleta && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Próxima Coleta</p>
              <p className="text-sm font-medium text-gray-900">{bombona.proxima_coleta}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(bombona.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver Detalhes Completos
          </button>
        )}
        {onShowLocation && (
          <button 
            onClick={() => onShowLocation(bombona.id)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Localizar
          </button>
        )}
        {onMaintenance && (
          <button 
            onClick={() => onMaintenance(bombona.id)}
            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Manutenção
          </button>
        )}
      </div>
    </div>
  );
}
