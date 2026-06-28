"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção do ícone padrão do Leaflet no React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMap({ businesses }: { businesses: any[] }) {
  // Centro aproximado de Salinas da Margarida
  const center = [-12.8683, -38.7661];

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative z-0">
      <MapContainer 
        center={center as [number, number]} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {businesses.map((b) => (
          // Como não temos lat/lng salvos ainda para todas as lojas, simulamos pequenas variações ao redor do centro para visualização
          <Marker 
            key={b.id} 
            position={[
              -12.8683 + (Math.random() - 0.5) * 0.01, 
              -38.7661 + (Math.random() - 0.5) * 0.01
            ]} 
            icon={icon}
          >
            <Popup>
              <div className="font-bold">{b.name}</div>
              <div className="text-xs text-slate-500">{b.category}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
