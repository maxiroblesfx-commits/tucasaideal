'use client';

import { X, Video } from 'lucide-react';
import { toast } from 'sonner';

interface Property {
  id: number;
  title: string;
  location: string;
  priceLabel: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  features: string[];
  score: number;
}

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  onContact: (id: number) => void;
}

export default function PropertyModal({ property, onClose, onContact }: PropertyModalProps) {
  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white max-w-6xl w-full rounded-3xl overflow-hidden modal relative"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-[#0A1628] rounded-full shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="grid lg:grid-cols-5">
          <div className="lg:col-span-3 relative">
            <img 
              src={property.image} 
              className="w-full h-[480px] lg:h-full object-cover" 
              alt={property.title} 
            />
            
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="bg-white px-4 py-1 rounded-full text-xs font-semibold">EXCLUSIVA</div>
              <button 
                onClick={() => toast.info("Tour Virtual 3D — se integra con Matterport en producción.")}
                className="cursor-pointer bg-white/90 px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-x-2"
              >
                <Video className="w-3 h-3" /> Tour 3D
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2 p-9">
            <div>
              <div className="font-bold text-4xl tracking-tighter">{property.priceLabel}</div>
              <div className="text-2xl font-semibold mt-1">{property.title}</div>
              <div className="text-[#2C3E50]/70 mt-1">{property.location}</div>
            </div>
            
            <div className="my-8 grid grid-cols-3 gap-px bg-[#0A1628]/10">
              <div className="bg-white py-4 px-5 text-center">
                <div className="font-bold text-3xl">{property.bedrooms}</div>
                <div className="text-xs tracking-wider">DORMITORIOS</div>
              </div>
              <div className="bg-white py-4 px-5 text-center">
                <div className="font-bold text-3xl">{property.bathrooms}</div>
                <div className="text-xs tracking-wider">BAÑOS</div>
              </div>
              <div className="bg-white py-4 px-5 text-center">
                <div className="font-bold text-3xl">{property.area}</div>
                <div className="text-xs tracking-wider">m²</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="uppercase text-xs tracking-widest font-semibold">PUNTUACIÓN IA</div>
                <div className="font-bold text-[#C5A46E]">{property.score}/100</div>
              </div>
              <div className="h-2 bg-[#0A1628]/10 rounded-full">
                <div className="h-2 bg-[#C5A46E] rounded-full" style={{ width: `${property.score}%` }}></div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="uppercase text-xs tracking-widest font-semibold mb-3">CARACTERÍSTICAS</div>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="border px-3.5 py-1 text-xs rounded-full">{feature}</div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => onContact(property.id)} 
                className="flex-1 py-3.5 bg-[#0A1628] text-white text-sm font-semibold rounded-2xl"
              >
                Solicitar visita privada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
