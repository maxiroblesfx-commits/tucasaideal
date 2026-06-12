'use client';

import { useState } from 'react';
import { Heart, Scale } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  price: number;
  priceLabel: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  features: string[];
  featured: boolean;
  score: number;
}

interface PropertyCardProps {
  property: Property;
  onView: (id: number) => void;
  onCompare: (id: number) => void;
  isSelectedForCompare: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export default function PropertyCard({ 
  property, 
  onView, 
  onCompare, 
  isSelectedForCompare, 
  isFavorite, 
  onToggleFavorite 
}: PropertyCardProps) {
  return (
    <div 
      onClick={() => onView(property.id)} 
      className="property-card group bg-white border border-[#0A1628]/10 rounded-3xl overflow-hidden cursor-pointer"
    >
      <div className="relative h-60 overflow-hidden">
        <img 
          src={property.image} 
          className="property-image w-full h-full object-cover" 
          alt={property.title} 
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }} 
            className={`bg-white/95 p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCompare(property.id);
            }} 
            className={`bg-white/95 p-2 rounded-full transition-colors ${isSelectedForCompare ? 'bg-[#C5A46E] text-white' : 'text-gray-400 hover:text-[#C5A46E]'}`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
        
        {property.featured && (
          <div className="absolute top-4 left-4 bg-[#C5A46E] text-[#0A1628] px-3 py-0.5 text-xs font-bold tracking-wider rounded">
            DESTACADA
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-x-1">
          <span>IA Score:</span> 
          <span className="font-bold text-[#C5A46E]">{property.score}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-xl tracking-tight">{property.title}</div>
            <div className="flex items-center text-sm text-[#2C3E50]/70 mt-1">
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl tracking-tighter">{property.priceLabel}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-4 mt-6 text-sm">
          <div className="flex items-center gap-x-1">
            <span>{property.bedrooms}</span>
            <span className="text-[#C5A46E]">bed</span>
          </div>
          <div className="flex items-center gap-x-1">
            <span>{property.bathrooms}</span>
            <span className="text-[#C5A46E]">bath</span>
          </div>
          <div>
            <span>{property.area} m²</span>
          </div>
        </div>
        
        <div className="mt-5 flex flex-wrap gap-1.5">
          {property.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="text-xs px-3 py-px border border-[#0A1628]/10 rounded-full">
              {feature}
            </div>
          ))}
        </div>
        
        <div className="mt-5 text-xs text-[#2C3E50]/60 flex items-center gap-x-1">
          <span>{12 + (property.id * 17) % 40} personas vieron esta propiedad hoy</span>
        </div>
      </div>
    </div>
  );
}
