'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { MapPin, Award, Users, TrendingUp, Download, Calendar, MessageCircle, Menu, X } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyModal from '@/components/PropertyModal';
import AIMatchQuiz from '@/components/AIMatchQuiz';

// Mapa solo en cliente (Leaflet usa window): se carga sin SSR.
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-sm text-[#2C3E50]/60">Cargando mapa…</div>
  ),
});

// Types
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
  lat: number;
  lng: number;
}

// Properties Data
const properties: Property[] = [
  { id: 1, title: "Penthouse con vista al Río", location: "Puerto Madero", type: "departamento", price: 2450000, priceLabel: "USD 2.450.000", bedrooms: 4, bathrooms: 5, area: 380, image: "/properties/p1.jpg", features: ["Vista al río", "Smart Home", "Pileta"], featured: true, score: 96, lat: -34.6037, lng: -58.3816 },
  { id: 2, title: "Casa de Campo con Estancia", location: "San Isidro", type: "casa", price: 3850000, priceLabel: "USD 3.850.000", bedrooms: 6, bathrooms: 7, area: 1250, image: "/properties/p2.jpg", features: ["Quincho", "Pileta", "Estancia"], featured: true, score: 94, lat: -34.4708, lng: -58.5111 },
  { id: 3, title: "Departamento de Lujo en Recoleta", location: "Recoleta", type: "departamento", price: 980000, priceLabel: "USD 980.000", bedrooms: 3, bathrooms: 3, area: 185, image: "/properties/p3.jpg", features: ["Balcón", "Gimnasio"], featured: false, score: 88, lat: -34.5875, lng: -58.3974 },
  { id: 4, title: "Townhouse Premium en Palermo", location: "Palermo", type: "ph", price: 1650000, priceLabel: "USD 1.650.000", bedrooms: 4, bathrooms: 4, area: 320, image: "/properties/p4.jpg", features: ["Terraza", "Jardín", "Smart Home"], featured: true, score: 92, lat: -34.5731, lng: -58.4242 },
  { id: 5, title: "Estancia en el Delta", location: "Tigre", type: "terreno", price: 4750000, priceLabel: "USD 4.750.000", bedrooms: 8, bathrooms: 9, area: 4500, image: "/properties/p5.jpg", features: ["Pileta", "Quincho", "Vista al río"], featured: true, score: 98, lat: -34.4261, lng: -58.5797 },
  { id: 6, title: "PH Moderno en Belgrano", location: "Belgrano", type: "ph", price: 720000, priceLabel: "USD 720.000", bedrooms: 3, bathrooms: 3, area: 210, image: "/properties/p6.jpg", features: ["Patio", "Estacionamiento"], featured: false, score: 85, lat: -34.5628, lng: -58.4539 },
  { id: 7, title: "Penthouse con Terraza Infinity", location: "Puerto Madero", type: "departamento", price: 3120000, priceLabel: "USD 3.120.000", bedrooms: 5, bathrooms: 6, area: 420, image: "/properties/p7.jpg", features: ["Vista al río", "Smart Home", "Terraza"], featured: true, score: 95, lat: -34.6037, lng: -58.3816 },
  { id: 8, title: "Villa con Piscina en San Isidro", location: "San Isidro", type: "casa", price: 2750000, priceLabel: "USD 2.750.000", bedrooms: 5, bathrooms: 6, area: 680, image: "/properties/p8.jpg", features: ["Pileta", "Quincho", "Jardín"], featured: false, score: 90, lat: -34.4708, lng: -58.5111 },
  { id: 9, title: "Departamento Exclusivo Recoleta", location: "Recoleta", type: "departamento", price: 1450000, priceLabel: "USD 1.450.000", bedrooms: 4, bathrooms: 4, area: 240, image: "/properties/p9.jpg", features: ["Balcón", "Gimnasio", "Smart Home"], featured: true, score: 89, lat: -34.5875, lng: -58.3974 },
  { id: 10, title: "Townhouse con Jardín en Palermo", location: "Palermo", type: "ph", price: 1890000, priceLabel: "USD 1.890.000", bedrooms: 4, bathrooms: 5, area: 290, image: "/properties/p10.jpg", features: ["Jardín", "Terraza", "Smart Home"], featured: false, score: 91, lat: -34.5731, lng: -58.4242 },
  { id: 11, title: "Estancia de Lujo en Tigre", location: "Tigre", type: "terreno", price: 5900000, priceLabel: "USD 5.900.000", bedrooms: 9, bathrooms: 10, area: 6200, image: "/properties/p11.jpg", features: ["Pileta", "Quincho", "Vista al río"], featured: true, score: 97, lat: -34.4261, lng: -58.5797 },
  { id: 12, title: "PH Clásico en Belgrano", location: "Belgrano", type: "ph", price: 890000, priceLabel: "USD 890.000", bedrooms: 3, bathrooms: 3, area: 195, image: "/properties/p12.jpg", features: ["Patio", "Estacionamiento"], featured: false, score: 84, lat: -34.5628, lng: -58.4539 },
];

export default function TuCasaIdeal() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filtered properties
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || prop.type === typeFilter;
    const matchesLocation = !locationFilter || prop.location.toLowerCase().replace(/\s/g, '-') === locationFilter;
    return matchesSearch && matchesType && matchesLocation;
  });

  // Handlers
  const handleViewProperty = (id: number) => {
    const prop = properties.find(p => p.id === id);
    if (prop) setSelectedProperty(prop);
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
    toast.success(favorites.includes(id) ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const handleCompare = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        toast.error("Máximo 3 propiedades para comparar");
        return;
      }
      setSelectedForCompare(prev => [...prev, id]);
    }
  };

  const openCompareModal = () => {
    if (selectedForCompare.length < 2) {
      toast.error("Selecciona al menos 2 propiedades");
      return;
    }
    setShowCompareModal(true);
  };

  const openContactModal = () => setShowContactModal(true);
  const openOwnerModal = () => setShowOwnerModal(true);
  const openValuationModal = () => setShowValuationModal(true);

  const handleContact = (id: number) => {
    setSelectedProperty(null);
    setShowContactModal(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setLocationFilter('');
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="premium-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-x-3">
              <div className="w-11 h-11 bg-[#C5A46E] flex items-center justify-center rounded-full">
                <span className="text-[#0A1628] font-bold text-3xl tracking-tighter">T</span>
              </div>
              <div>
                <div className="font-bold text-3xl tracking-[-1.5px] text-white">TuCasaIdeal</div>
                <div className="text-[9px] text-[#C5A46E] -mt-1 tracking-[3px] font-medium">EST. 2004</div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-x-9 text-sm font-medium text-white">
              <a href="#propiedades" className="nav-link">Propiedades</a>
              <a href="#mapa" className="nav-link">Mapa</a>
              <a href="#match" className="nav-link">Match IA</a>
              <a href="#vender" className="nav-link">Vender</a>
              <a href="#tasacion" className="nav-link">Tasación</a>
            </div>

            <div className="flex items-center gap-x-3">
              <button onClick={openContactModal} className="hidden md:block px-6 py-2.5 text-sm font-semibold border border-white/30 text-white rounded-full hover:bg-white hover:text-[#0A1628]">
                Contactar
              </button>
              
              <a href="https://wa.me/5491145678901" target="_blank" className="flex items-center gap-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>

              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-label="Abrir menú"
                aria-expanded={mobileMenuOpen}
                className="lg:hidden w-11 h-11 flex items-center justify-center text-white border border-white/30 rounded-full hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-5">
              <div className="flex flex-col gap-y-1 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                {[
                  { href: '#propiedades', label: 'Propiedades' },
                  { href: '#mapa', label: 'Mapa' },
                  { href: '#match', label: 'Match IA' },
                  { href: '#vender', label: 'Vender' },
                  { href: '#tasacion', label: 'Tasación' },
                ].map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-white rounded-xl hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); openContactModal(); }}
                  className="mt-1 px-4 py-3 text-sm font-semibold text-[#0A1628] bg-[#C5A46E] hover:bg-[#B38A4E] rounded-xl text-left"
                >
                  Contactar
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <header className="luxury-hero h-screen flex items-center pt-16 relative">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <div className="w-2 h-2 bg-[#C5A46E] rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium tracking-widest">MIEMBRO DE LUXURY PORTFOLIO INTERNATIONAL</span>
            </div>
            
            <h1 className="text-white text-7xl md:text-8xl font-bold tracking-tighter leading-[0.92] heading-serif mb-4">
              Tu casa ideal.<br />Tu legado.
            </h1>
            
            <p className="max-w-lg text-xl text-white/90 mb-9">
              Descubre propiedades exclusivas con el acompañamiento de expertos que entienden el lujo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })} 
                      className="premium-btn bg-[#C5A46E] hover:bg-[#B38A4E] text-[#0A1628] font-semibold px-9 py-4 rounded-full text-lg flex items-center justify-center gap-x-3 shadow-xl">
                Explorar Propiedades <span>→</span>
              </button>
              <button onClick={openValuationModal} className="premium-btn bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/40 text-white font-semibold px-9 py-4 rounded-full text-lg flex items-center justify-center gap-x-3">
                Tasación Gratuita
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-[#0A1628]/10 py-5">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-x-12 gap-y-4 text-center text-sm">
            <div className="flex items-center gap-x-2"><MapPin className="text-[#C5A46E]" /> <strong>84 países</strong> • Alcance global</div>
            <div className="flex items-center gap-x-2"><Award className="text-[#C5A46E]" /> <strong>Top 1%</strong> Luxury International</div>
            <div className="flex items-center gap-x-2"><TrendingUp className="text-[#C5A46E]" /> <strong>$1.2B USD</strong> transacciones 2025</div>
            <div className="flex items-center gap-x-2"><Users className="text-[#C5A46E]" /> <strong>4.98/5</strong> Google Reviews</div>
          </div>
        </div>
      </div>

      {/* PROPIEDADES */}
      <section id="propiedades" className="max-w-screen-2xl mx-auto px-8 pt-20 pb-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="uppercase tracking-[3px] text-xs font-semibold text-[#C5A46E]">EXCLUSIVIDAD • 142 PROPIEDADES</div>
            <h2 className="heading-serif text-6xl font-bold tracking-tighter">Propiedades Destacadas</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => toast.info(`Tienes ${favorites.length} propiedades en favoritos`)} className="px-5 py-2.5 text-sm font-semibold border border-[#0A1628] rounded-full flex items-center gap-x-2 hover:bg-[#0A1628] hover:text-white">
              Favoritos ({favorites.length})
            </button>
            <button onClick={openCompareModal} className="px-5 py-2.5 text-sm font-semibold border border-[#0A1628] rounded-full flex items-center gap-x-2 hover:bg-[#0A1628] hover:text-white">
              Comparar ({selectedForCompare.length})
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-9 bg-white border border-[#0A1628]/10 p-6 rounded-3xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Buscar por barrio, tipo o características..." 
              className="flex-1 bg-[#F8F5F0] border border-[#0A1628]/10 focus:border-[#C5A46E] rounded-2xl px-5 py-3.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-white border border-[#0A1628]/10 rounded-2xl px-4 py-3 text-sm">
              <option value="">Tipo</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="ph">PH</option>
              <option value="terreno">Terreno</option>
            </select>
            
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="bg-white border border-[#0A1628]/10 rounded-2xl px-4 py-3 text-sm">
              <option value="">Ubicación</option>
              <option value="palermo">Palermo</option>
              <option value="recoleta">Recoleta</option>
              <option value="puerto-madero">Puerto Madero</option>
              <option value="belgrano">Belgrano</option>
              <option value="san-isidro">San Isidro</option>
              <option value="tigre">Tigre</option>
            </select>
            
            <button onClick={resetFilters} className="px-5 py-3 text-sm border border-[#0A1628]/10 hover:bg-[#F8F5F0] rounded-2xl font-medium">
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
              onCompare={handleCompare}
              isSelectedForCompare={selectedForCompare.includes(property.id)}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* AI MATCH QUIZ */}
      <section id="match" className="bg-[#0A1628] text-white py-20">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline px-4 py-1 bg-[#C5A46E]/10 text-[#C5A46E] rounded-full text-xs font-semibold tracking-widest mb-4">INTELIGENCIA ARTIFICIAL v2</div>
            <h2 className="heading-serif text-6xl tracking-tighter font-bold">Match IA: Encuentra tu propiedad perfecta</h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <AIMatchQuiz 
              properties={properties} 
              onViewProperty={handleViewProperty} 
            />
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section id="mapa" className="max-w-screen-2xl mx-auto px-8 py-20 bg-white border-y border-[#0A1628]/10">
        <div className="text-center mb-10">
          <div className="uppercase tracking-[3px] text-xs font-semibold text-[#C5A46E]">UBICACIONES EXCLUSIVAS</div>
          <h2 className="heading-serif text-6xl font-bold tracking-tighter">Explora en el Mapa</h2>
        </div>
        
        <div className="h-[520px] rounded-3xl border border-[#0A1628]/10 shadow-xl overflow-hidden relative z-0">
          <PropertyMap properties={properties} onViewProperty={handleViewProperty} />
        </div>
      </section>

      {/* CAPTACIÓN */}
      <section id="vender" className="max-w-screen-2xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-x-16 items-center">
          <div className="lg:col-span-7">
            <div className="uppercase tracking-[3px] text-xs text-[#C5A46E] mb-3">PARA PROPIETARIOS</div>
            <h2 className="heading-serif text-6xl font-bold tracking-tighter leading-none mb-6">Vende tu propiedad con máxima discreción.</h2>
            
            <div className="grid grid-cols-3 gap-4 text-sm mb-9">
              <div className="bg-[#F8F5F0] p-5 rounded-2xl"><div className="font-bold text-3xl">98%</div><div className="text-xs mt-1">tasa de cierre</div></div>
              <div className="bg-[#F8F5F0] p-5 rounded-2xl"><div className="font-bold text-3xl">42 días</div><div className="text-xs mt-1">promedio de venta</div></div>
              <div className="bg-[#F8F5F0] p-5 rounded-2xl"><div className="font-bold text-3xl">+18%</div><div className="text-xs mt-1">sobre precio de mercado</div></div>
            </div>
            
            <button onClick={openOwnerModal} className="premium-btn bg-[#C5A46E] hover:bg-[#B38A4E] text-[#0A1628] px-9 py-4 font-semibold rounded-full flex items-center gap-x-3 text-lg">
              Quiero vender mi propiedad →
            </button>
          </div>
          
          <div className="lg:col-span-5 mt-12 lg:mt-0 bg-white border border-[#0A1628]/10 p-8 rounded-3xl">
            <div className="text-sm font-semibold mb-4 text-[#C5A46E]">BENEFICIOS EXCLUSIVOS</div>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-x-3"><span className="text-[#C5A46E]">✓</span> Marketing internacional en 14 países</li>
              <li className="flex gap-x-3"><span className="text-[#C5A46E]">✓</span> Fotografía profesional + video 4K + tours 3D</li>
              <li className="flex gap-x-3"><span className="text-[#C5A46E]">✓</span> Red de compradores VIP y family offices</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TASACIÓN */}
      <section id="tasacion" className="bg-white border-y border-[#0A1628]/10 py-20">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline px-4 py-1 bg-[#C5A46E]/10 text-[#C5A46E] rounded-full text-xs font-semibold tracking-widest mb-4">INTELIGENCIA ARTIFICIAL</div>
            <h2 className="heading-serif text-6xl tracking-tighter font-bold">Tasación Online Instantánea</h2>
          </div>
          
          <div className="max-w-2xl mx-auto bg-[#F8F5F0] border border-[#0A1628]/10 rounded-3xl p-9">
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("¡Tasación recibida! Un asesor te contactará en menos de 60 minutos.");
              setShowValuationModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="text-xs font-semibold">TIPO</label><select className="w-full border border-[#0A1628]/10 rounded-2xl px-5 py-3.5 text-sm" required><option>Casa</option><option>Departamento</option><option>PH</option><option>Estancia</option></select></div>
                <div><label className="text-xs font-semibold">UBICACIÓN</label><input type="text" placeholder="Palermo, Buenos Aires" className="w-full border border-[#0A1628]/10 rounded-2xl px-5 py-3.5 text-sm" required /></div>
                <div><label className="text-xs font-semibold">m²</label><input type="number" placeholder="320" className="w-full border border-[#0A1628]/10 rounded-2xl px-5 py-3.5 text-sm" required /></div>
                <div><label className="text-xs font-semibold">DORMITORIOS</label><input type="number" placeholder="4" className="w-full border border-[#0A1628]/10 rounded-2xl px-5 py-3.5 text-sm" required /></div>
              </div>
              <button type="submit" className="mt-8 w-full py-4 bg-[#0A1628] text-white font-semibold rounded-2xl flex items-center justify-center gap-x-2 text-lg">
                Obtener Tasación con IA
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A1628] text-white/80 pt-16 pb-8">
        <div className="max-w-screen-2xl mx-auto px-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-4">
            <div>© 2026 TuCasaIdeal. Miembro Luxury Portfolio International.</div>
            <div className="flex gap-x-6">
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Accesibilidad</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <button onClick={openContactModal} className="flex items-center gap-x-2 bg-[#0A1628] hover:bg-black text-white px-5 py-3 rounded-full shadow-2xl text-sm font-semibold">
          <Calendar className="w-4 h-4" /> Agendar Visita
        </button>
        <button onClick={() => setShowChatbot(true)} className="flex items-center gap-x-3 bg-[#C5A46E] hover:bg-[#B38A4E] text-[#0A1628] px-6 py-3.5 rounded-full shadow-2xl text-sm font-semibold">
          <MessageCircle className="w-4 h-4" /> Chat IA
        </button>
      </div>

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
          onContact={handleContact} 
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-3xl p-8">
            <div className="flex justify-between mb-6">
              <div><div className="font-bold text-3xl">Hablemos</div></div>
              <button onClick={() => setShowContactModal(false)} className="text-3xl">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("¡Gracias! Un asesor te contactará en menos de 2 horas.");
              setShowContactModal(false);
            }}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div><label className="text-xs font-medium">Nombre</label><input type="text" className="border w-full mt-1.5 px-5 py-3 rounded-2xl" required /></div>
                  <div><label className="text-xs font-medium">Apellido</label><input type="text" className="border w-full mt-1.5 px-5 py-3 rounded-2xl" required /></div>
                </div>
                <div><label className="text-xs font-medium">Email</label><input type="email" className="border w-full mt-1.5 px-5 py-3 rounded-2xl" required /></div>
                <div><label className="text-xs font-medium">Teléfono</label><input type="tel" className="border w-full mt-1.5 px-5 py-3 rounded-2xl" required /></div>
                <div><label className="text-xs font-medium">Mensaje</label><textarea className="border w-full mt-1.5 px-5 py-3 rounded-2xl h-24" placeholder="¿En qué podemos ayudarte?"></textarea></div>
              </div>
              <button type="submit" className="mt-6 w-full py-4 bg-[#0A1628] text-white font-semibold rounded-2xl">Enviar solicitud</button>
            </form>
          </div>
        </div>
      )}

      {/* Owner Modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={() => setShowOwnerModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white max-w-xl w-full rounded-3xl p-9">
            <div className="text-center mb-7"><div className="font-bold text-3xl">¿Quieres vender tu propiedad?</div></div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("Solicitud recibida. Un especialista te contactará en 4 horas.");
              setShowOwnerModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><input type="text" placeholder="Dirección" className="border px-5 py-3.5 w-full rounded-2xl" required /></div>
                <div><input type="text" placeholder="Nombre" className="border px-5 py-3.5 w-full rounded-2xl" required /></div>
                <div><input type="tel" placeholder="Teléfono" className="border px-5 py-3.5 w-full rounded-2xl" required /></div>
                <div className="md:col-span-2"><input type="email" placeholder="Email" className="border px-5 py-3.5 w-full rounded-2xl" required /></div>
              </div>
              <button type="submit" className="mt-6 w-full bg-[#0A1628] py-4 font-semibold text-white rounded-2xl">Enviar solicitud confidencial</button>
            </form>
          </div>
        </div>
      )}

      {/* Valuation Modal */}
      {showValuationModal && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={() => setShowValuationModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white max-w-xl w-full rounded-3xl p-8">
            <div className="flex justify-between mb-6">
              <div><div className="font-bold text-3xl">Tasación con IA</div></div>
              <button onClick={() => setShowValuationModal(false)} className="text-3xl">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("¡Tasación recibida! Un asesor te contactará pronto.");
              setShowValuationModal(false);
            }}>
              <div className="space-y-6">
                <div><label className="text-sm font-medium">Dirección o Barrio</label><input type="text" className="w-full mt-1.5 px-5 py-3 border border-[#0A1628]/10 rounded-2xl" placeholder="Ej: Av. Alvear 1800, Recoleta" required /></div>
                <div className="grid grid-cols-2 gap-5">
                  <div><label className="text-sm font-medium">Tipo</label><select className="w-full mt-1.5 px-5 py-3 border border-[#0A1628]/10 rounded-2xl" required><option>Casa</option><option>Departamento</option><option>PH</option><option>Estancia</option></select></div>
                  <div><label className="text-sm font-medium">m² aproximados</label><input type="number" className="w-full mt-1.5 px-5 py-3 border border-[#0A1628]/10 rounded-2xl" placeholder="280" required /></div>
                </div>
                <button type="submit" className="premium-btn w-full py-4 bg-[#C5A46E] text-[#0A1628] font-semibold rounded-2xl flex justify-center items-center gap-x-2">Calcular Valor Estimado</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Magnet Modal */}
      {showLeadMagnet && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={() => setShowLeadMagnet(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white max-w-md w-full rounded-3xl p-9 text-center">
            <Download className="w-12 h-12 mx-auto text-[#C5A46E] mb-6" />
            <div className="font-bold text-2xl mb-2">Guía del Comprador de Lujo 2026</div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success("¡Gracias! La guía ha sido enviada a tu email.");
              setShowLeadMagnet(false);
            }}>
              <input type="email" placeholder="tu@email.com" className="border w-full px-5 py-3.5 rounded-2xl mb-4" required />
              <button type="submit" className="w-full py-3.5 bg-[#0A1628] text-white font-semibold rounded-2xl">Descargar ahora</button>
            </form>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={() => setShowCompareModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-5xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto modal">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="uppercase tracking-[3px] text-xs font-semibold text-[#C5A46E]">COMPARADOR</div>
                <div className="font-bold text-3xl tracking-tighter">Comparar propiedades</div>
              </div>
              <button onClick={() => setShowCompareModal(false)} aria-label="Cerrar" className="text-3xl leading-none">&times;</button>
            </div>

            <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${properties.filter(p => selectedForCompare.includes(p.id)).length}, minmax(0, 1fr))` }}>
              {properties.filter(p => selectedForCompare.includes(p.id)).map(prop => (
                <div key={prop.id} className="border border-[#0A1628]/10 rounded-2xl overflow-hidden">
                  <img src={prop.image} alt={prop.title} className="w-full h-36 object-cover" />
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="font-semibold text-base leading-tight">{prop.title}</div>
                      <div className="text-xs text-[#2C3E50]/70 mt-0.5">{prop.location}</div>
                    </div>
                    <div className="font-bold text-lg tracking-tighter">{prop.priceLabel}</div>
                    <dl className="text-sm divide-y divide-[#0A1628]/10">
                      <div className="flex justify-between py-2"><dt className="text-[#2C3E50]/60">Dormitorios</dt><dd className="font-semibold">{prop.bedrooms}</dd></div>
                      <div className="flex justify-between py-2"><dt className="text-[#2C3E50]/60">Baños</dt><dd className="font-semibold">{prop.bathrooms}</dd></div>
                      <div className="flex justify-between py-2"><dt className="text-[#2C3E50]/60">Superficie</dt><dd className="font-semibold">{prop.area} m²</dd></div>
                      <div className="flex justify-between py-2"><dt className="text-[#2C3E50]/60">Tipo</dt><dd className="font-semibold capitalize">{prop.type}</dd></div>
                      <div className="flex justify-between py-2"><dt className="text-[#2C3E50]/60">IA Score</dt><dd className="font-bold text-[#C5A46E]">{prop.score}</dd></div>
                    </dl>
                    <div className="flex flex-wrap gap-1.5">
                      {prop.features.map((f, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-px border border-[#0A1628]/10 rounded-full">{f}</span>
                      ))}
                    </div>
                    <button onClick={() => { setShowCompareModal(false); handleViewProperty(prop.id); }} className="w-full py-2.5 bg-[#0A1628] text-white text-sm font-semibold rounded-xl">Ver detalle</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-end lg:items-center justify-center" onClick={() => setShowChatbot(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white w-full lg:w-[420px] lg:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#0A1628] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-x-3">
                <div className="w-9 h-9 bg-[#C5A46E] flex items-center justify-center rounded-full">🤖</div>
                <div><div className="font-semibold">Luna • Asistente IA</div></div>
              </div>
              <button onClick={() => setShowChatbot(false)} className="text-xl">&times;</button>
            </div>
            <div className="h-[420px] overflow-y-auto p-6 space-y-4 bg-[#F8F5F0]">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#C5A46E] flex-shrink-0 flex items-center justify-center rounded-full">🤖</div>
                <div className="bg-white px-4 py-3 rounded-2xl text-sm">Hola, soy Luna. ¿En qué puedo ayudarte hoy?</div>
              </div>
            </div>
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <input type="text" placeholder="¿Buscas una propiedad?" className="flex-1 border border-[#0A1628]/10 rounded-full px-5 py-3 text-sm" />
                <button className="bg-[#0A1628] text-white px-5 rounded-full">→</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
