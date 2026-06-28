"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Heart, Store, ChevronRight, Loader2, CheckCircle2, Star, Map as MapIcon, List, FilterX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ReviewModal } from "@/components/ReviewModal";
import { MapWrapper } from "@/components/Map";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GuiaContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("categoria");

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [interactingId, setInteractingId] = useState<string | null>(null); // para spinner de ação
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Estado para o Modal de Avaliação
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<{id: string, name: string} | null>(null);

  // Estados locais para interações rápidas na UI (otimista)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [checkins, setCheckins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Garante ID do visitante
    let id = localStorage.getItem('guest_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guest_device_id', id);
    }
    setDeviceId(id);

    async function loadData() {
      // Busca lojistas com suas categorias
      const { data: bData } = await supabase.from('businesses').select('*, categories(name, slug)').order('name');
      if (bData) setBusinesses(bData);

      // Busca interações do usuário (para saber se já curtiu/fez checkin)
      const { data: iData } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', id);

      if (iData) {
        const favs: Record<string, boolean> = {};
        const chks: Record<string, boolean> = {};
        iData.forEach(interaction => {
          if (interaction.interaction_type === 'favorite') favs[interaction.business_id] = true;
          if (interaction.interaction_type === 'checkin') chks[interaction.business_id] = true;
        });
        setFavorites(favs);
        setCheckins(chks);
      }
      
      setLoading(false);
    }

    loadData();
  }, []);

  const handleFavorite = async (businessId: string) => {
    if (!deviceId) return;
    const isFav = favorites[businessId];
    
    // UI Otimista
    setFavorites(prev => ({ ...prev, [businessId]: !isFav }));

    if (isFav) {
      await supabase.from('user_interactions').delete().match({ user_id: deviceId, business_id: businessId, interaction_type: 'favorite' });
    } else {
      await supabase.from('user_interactions').insert([{ user_id: deviceId, business_id: businessId, interaction_type: 'favorite' }]);
    }
  };

  const handleCheckin = async (businessId: string) => {
    if (!deviceId || checkins[businessId]) return;
    
    setInteractingId(businessId);
    try {
      // 1. Registra checkin
      await supabase.from('user_interactions').insert([{ user_id: deviceId, business_id: businessId, interaction_type: 'checkin' }]);
      
      // 2. Dá os pontos
      const { data: profile } = await supabase.from('user_profiles').select('points').eq('id', deviceId).single();
      if (profile) {
        await supabase.from('user_profiles').update({ points: profile.points + 20 }).eq('id', deviceId);
      }
      
      // Atualiza UI
      setCheckins(prev => ({ ...prev, [businessId]: true }));
      alert("🎉 Check-in realizado! Você ganhou +20 Pontos Conecta!");
    } catch (e) {
      console.error(e);
      alert("Houve um erro ao fazer check-in.");
    } finally {
      setInteractingId(null);
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = search === "" || 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      (b.categories?.name || "").toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = !categoryFilter || 
      (b.categories?.slug === categoryFilter || (b.categories?.name || "").toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header Fixo */}
      <div className="sticky top-0 z-40 bg-brand-primary pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-brand-text">
            {categoryFilter ? `Lojas: ${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` : 'Guia Comercial'}
          </h1>
          <div className="flex items-center gap-2">
            {categoryFilter && (
              <Link href="/guia" className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                <FilterX className="w-5 h-5" />
              </Link>
            )}
            <div className="flex bg-white/20 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-brand-primary' : 'text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-white text-brand-primary' : 'text-white'}`}
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none text-slate-900 shadow-sm border border-transparent focus:border-brand-primary/30 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
            placeholder="Buscar lojas ou categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
            <p>Carregando parceiros...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
           <div className="text-center py-10 text-slate-500">
             Nenhuma loja encontrada.
           </div>
        ) : viewMode === 'map' ? (
           <div className="h-[60vh] w-full">
             <MapWrapper businesses={filteredBusinesses} />
           </div>
        ) : (
          <div className="space-y-4">
            {filteredBusinesses.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col group animate-fade-in">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 border border-slate-200">
                       {store.image_url ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
                       ) : (
                         <Store className="w-6 h-6" />
                       )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{store.name}</h3>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{store.categories?.name || 'Comércio Local'}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-2 h-2 rounded-full ${store.is_open ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className="text-xs text-slate-500">{store.is_open ? 'Aberto agora' : 'Fechado'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão Avaliar (Estrela) */}
                  <button 
                    onClick={() => {
                      setSelectedBusiness({id: store.id, name: store.name});
                      setReviewModalOpen(true);
                    }}
                    className="p-2 rounded-full hover:bg-amber-50 transition-colors"
                  >
                    <Star className="w-6 h-6 text-amber-400" />
                  </button>
                  {/* Botão Coração */}
                  <button 
                    onClick={() => handleFavorite(store.id)}
                    className="p-2 rounded-full hover:bg-slate-50 transition-colors"
                  >
                    <Heart className={`w-6 h-6 transition-colors ${favorites[store.id] ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  </button>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <Link 
                    href={`/guia/perfil?id=${store.id}`}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 rounded-xl text-sm transition-colors text-center block"
                  >
                    Ver Perfil
                  </Link>
                  
                  {/* Botão Check-in (Gamificação) */}
                  <button 
                    onClick={() => handleCheckin(store.id)}
                    disabled={checkins[store.id] || interactingId === store.id}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm
                      ${checkins[store.id] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                        : 'bg-brand-primary hover:bg-brand-primary/90 text-brand-text'
                      }
                    `}
                  >
                    {interactingId === store.id ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                    ) : checkins[store.id] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Visitado
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" /> Check-in
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Avaliação Injetado no Final */}
      {selectedBusiness && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          businessId={selectedBusiness.id}
          businessName={selectedBusiness.name}
          deviceId={deviceId || ""}
        />
      )}
    </div>
  );
}

export default function GuiaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>}>
      <GuiaContent />
    </Suspense>
  );
}
