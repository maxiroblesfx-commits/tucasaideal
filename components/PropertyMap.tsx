'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Property {
  id: number;
  title: string;
  location: string;
  priceLabel: string;
  lat: number;
  lng: number;
}

interface PropertyMapProps {
  properties: Property[];
  onViewProperty: (id: number) => void;
}

// Pin dorado custom (evita el problema de los íconos por defecto de Leaflet con bundlers).
const goldPin = L.divIcon({
  className: 'tci-pin',
  html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#C5A46E;border:2px solid #0A1628;box-shadow:0 6px 14px rgba(10,22,40,.45);transform:rotate(-45deg)"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
});

// Varias propiedades comparten barrio (mismas coords): un jitter determinístico evita que se superpongan.
function jitter(value: number, id: number, axis: number) {
  return value + (((id * 53 + axis * 17) % 11) - 5) * 0.0016;
}

export default function PropertyMap({ properties, onViewProperty }: PropertyMapProps) {
  return (
    <MapContainer
      center={[-34.55, -58.45]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {properties.map((p) => (
        <Marker key={p.id} position={[jitter(p.lat, p.id, 1), jitter(p.lng, p.id, 2)]} icon={goldPin}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong style={{ fontSize: 14 }}>{p.title}</strong>
              <div style={{ color: '#2C3E50', opacity: 0.7, margin: '2px 0 6px' }}>
                {p.location} · {p.priceLabel}
              </div>
              <button
                onClick={() => onViewProperty(p.id)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  background: '#0A1628',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Ver propiedad
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
