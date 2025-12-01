/**
 * AlertCard - Componente unificado para exibição de alertas
 * Suporta múltiplos variantes: full, compact, mini
 */

import { AlertTriangle, AlertCircle, Bell, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';

export interface AlertaData {
  id: number;
  bombona_identificacao: string;
  empresa: string;
  tipo: 'nivel_critico' | 'nivel_alto' | 'temperatura' | 'contaminacao' | 'sensor_offline' | 'manutencao';
  nivel: 'critico' | 'alto' | 'medio' | 'baixo';
  descricao: string;
  data_alerta: string;
  resolvido: boolean;
  tipo_residuo?: string;
}

interface AlertCardProps {
  alerta: AlertaData;
  variant?: 'full' | 'compact' | 'mini';
  onResolve?: (id: number) => void;
  onViewDetails?: (id: number) => void;
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

const getNivelColor = (nivel: string): string => {
  const colorMap: Record<string, string> = {
    critico: 'bg-red-100 text-red-800 border-red-300',
    alto: 'bg-orange-100 text-orange-800 border-orange-300',
    medio: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    baixo: 'bg-blue-100 text-blue-800 border-blue-300',
  };
  return colorMap[nivel] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getTipoIcon = (tipo: string) => {
  const iconProps = { className: 'w-5 h-5' };
  
  switch (tipo) {
    case 'nivel_critico':
    case 'nivel_alto':
      return <AlertTriangle {...iconProps} className="w-5 h-5 text-red-600" />;
    case 'temperatura':
      return <AlertCircle {...iconProps} className="w-5 h-5 text-orange-600" />;
    case 'contaminacao':
      return <AlertTriangle {...iconProps} className="w-5 h-5 text-red-700" />;
    case 'sensor_offline':
      return <AlertCircle {...iconProps} className="w-5 h-5 text-blue-600" />;
    case 'manutencao':
      return <Bell {...iconProps} className="w-5 h-5 text-yellow-600" />;
    default:
      return <AlertCircle {...iconProps} />;
  }
};

const formatDataAlerta = (dataStr: string): string => {
  try {
    const date = new Date(dataStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dataStr;
  }
};

export default function AlertCard({
  alerta,
  variant = 'full',
  onResolve,
  onViewDetails,
}: AlertCardProps) {
  
  // Variant: Mini (usado em dashboards, notificações)
  if (variant === 'mini') {
    return (
      <div className={`p-3 rounded-lg border ${
        alerta.resolvido ? 'bg-gray-50 border-gray-200' : 
        alerta.nivel === 'critico' ? 'bg-red-50 border-red-200' :
        alerta.nivel === 'alto' ? 'bg-orange-50 border-orange-200' :
        'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-2">
          {getTipoIcon(alerta.tipo)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{alerta.bombona_identificacao}</p>
            <p className="text-xs text-gray-600 truncate">{alerta.descricao}</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500">{formatDataAlerta(alerta.data_alerta)}</p>
            </div>
          </div>
          {!alerta.resolvido && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getNivelColor(alerta.nivel)}`}>
              {alerta.nivel.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  // Variant: Compact (usado em listas)
  if (variant === 'compact') {
    return (
      <div className={`border rounded-lg p-4 ${
        alerta.resolvido ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:shadow-md'
      } transition-shadow`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getTipoIcon(alerta.tipo)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h4 className="font-semibold text-gray-900">{alerta.bombona_identificacao}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getNivelColor(alerta.nivel)}`}>
                {alerta.nivel.toUpperCase()}
              </span>
              {alerta.tipo_residuo && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {getTipoResiduoText(alerta.tipo_residuo)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{alerta.empresa}</p>
            <p className="text-sm text-gray-900 mb-3">{alerta.descricao}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDataAlerta(alerta.data_alerta)}</span>
              </div>
              
              {!alerta.resolvido && onResolve && (
                <button
                  onClick={() => onResolve(alerta.id)}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Marcar como resolvido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Full (padrão, com todas as informações e ações)
  return (
    <div className={`border rounded-xl p-6 ${
      alerta.resolvido ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:shadow-lg'
    } transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${
            alerta.nivel === 'critico' ? 'bg-red-100' :
            alerta.nivel === 'alto' ? 'bg-orange-100' :
            alerta.nivel === 'medio' ? 'bg-yellow-100' :
            'bg-blue-100'
          }`}>
            {getTipoIcon(alerta.tipo)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{alerta.bombona_identificacao}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getNivelColor(alerta.nivel)}`}>
                {alerta.nivel.toUpperCase()}
              </span>
              {alerta.resolvido && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Resolvido
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{alerta.empresa}</p>
            {alerta.tipo_residuo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Package className="w-3 h-3 mr-1" />
                {getTipoResiduoText(alerta.tipo_residuo)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">Descrição do Alerta</p>
        <p className="text-sm text-gray-700">{alerta.descricao}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDataAlerta(alerta.data_alerta)}</span>
        </div>
        
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(alerta.id)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Ver Detalhes
            </button>
          )}
          {!alerta.resolvido && onResolve && (
            <button
              onClick={() => onResolve(alerta.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Resolver Alerta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
