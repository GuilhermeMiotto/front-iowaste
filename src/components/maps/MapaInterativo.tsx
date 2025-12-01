'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet no Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface Bombona {
  id: number;
  identificacao: string;
  empresa: string;
  localizacao: string;
  tipo_residuo: string;
  status: 'normal' | 'quase_cheia' | 'cheia' | 'manutencao';
  latitude: number;
  longitude: number;
  percentual_ocupacao: number;
  peso_atual: number;
  capacidade: number;
}

interface MapaInterativoProps {
  bombonas: Bombona[];
  height?: string;
  zoom?: number;
  showControls?: boolean;
  onBombonaClick?: (bombona: Bombona) => void;
}

const MapaInterativo: React.FC<MapaInterativoProps> = ({
  bombonas,
  height = '600px',
  zoom = 10,
  showControls = true,
  onBombonaClick
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'normal': '#10b981',
      'quase_cheia': '#f59e0b',
      'cheia': '#ef4444',
      'manutencao': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status: string): string => {
    const texts: { [key: string]: string } = {
      'normal': 'Normal',
      'quase_cheia': 'Quase Cheia',
      'cheia': 'Cheia',
      'manutencao': 'Manutenção'
    };
    return texts[status] || status;
  };

  const getTipoResiduoText = (tipo: string): string => {
    const tipos: { [key: string]: string } = {
      'hospitalar_infectante': 'Hospitalar Infectante',
      'hospitalar_quimico': 'Hospitalar Químico',
      'hospitalar_perfurocortante': 'Perfurocortante',
      'farmaceutico': 'Farmacêutico',
      'solventes_organicos': 'Solventes Orgânicos',
    };
    return tipos[tipo] || tipo;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Limpa mapa anterior se existir
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Cria o mapa centralizado em Cianorte, Paraná
    const map = L.map(mapContainerRef.current).setView([-23.6636, -52.6056], zoom);
    mapRef.current = map;

    // Adiciona tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Adiciona marcadores para cada bombona
    bombonas.forEach((bombona) => {
      const color = getStatusColor(bombona.status);
      const statusText = getStatusText(bombona.status);
      
      // Cria ícone customizado colorido por status
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              line-height: 24px;
            ">●</div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([bombona.latitude, bombona.longitude], {
        icon: customIcon
      }).addTo(map);

      // Popup com informações da bombona
      const popupContent = `
        <div style="min-width: 220px; font-family: system-ui;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: #111;">${bombona.identificacao}</h3>
          <div style="font-size: 13px; color: #555; line-height: 1.6;">
            <p style="margin: 6px 0;"><strong>Empresa:</strong><br/>${bombona.empresa}</p>
            <p style="margin: 6px 0;"><strong>Localização:</strong> ${bombona.localizacao}</p>
            <p style="margin: 6px 0;"><strong>Tipo:</strong> ${getTipoResiduoText(bombona.tipo_residuo)}</p>
            <p style="margin: 6px 0;">
              <strong>Status:</strong> 
              <span style="color: ${color}; font-weight: bold;">${statusText}</span>
            </p>
            <p style="margin: 6px 0;"><strong>Ocupação:</strong> ${bombona.percentual_ocupacao}%</p>
            <p style="margin: 6px 0;"><strong>Peso:</strong> ${bombona.peso_atual}kg / ${bombona.capacidade}kg</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      // Adiciona evento de clique
      if (onBombonaClick) {
        marker.on('click', () => {
          onBombonaClick(bombona);
        });
      }
    });

    // Ajusta o zoom para mostrar todas as bombonas
    if (bombonas.length > 0) {
      const bounds = L.latLngBounds(
        bombonas.map(b => [b.latitude, b.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [bombonas, zoom, onBombonaClick]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Legenda */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legenda</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Normal (&lt; 75%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Quase Cheia (75-89%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Cheia (≥ 90%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Manutenção</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Info */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-900">{bombonas.length}</span> bombonas monitoradas
        </p>
      </div>
    </div>
  );
};

export default MapaInterativo;
