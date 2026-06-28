"use client";

import { useEffect, useState } from "react";
import { Gift, Ticket, Trophy, Loader2, Calendar, Tag, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sweepstakes, setSweepstakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState("");
  const [participating, setParticipating] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem('guest_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guest_device_id', id);
    }
    setDeviceId(id);

    async function loadData() {
      // 1. Busca Campanhas (Promoções)
      const { data: cData } = await supabase
        .from('campaigns')
        .select('*, businesses(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (cData) setCampaigns(cData);

      // 2. Busca Sorteios
      const { data: sData } = await supabase
        .from('sweepstakes')
        .select('*')
        .order('draw_date', { ascending: true });
        
      if (sData) setSweepstakes(sData);

      // 3. Verifica em quais sorteios eu já participo
      const { data: pData } = await supabase
        .from('sweepstake_participants')
        .select('sweepstake_id')
        .eq('user_id', id);

      if (pData) {
        const pMap: Record<string, boolean> = {};
        pData.forEach(p => pMap[p.sweepstake_id] = true);
        setParticipating(pMap);
      }

      setLoading(false);
    }
    
    loadData();
  }, []);

  const handleParticipate = async (sweepstakeId: string) => {
    if (!deviceId || participating[sweepstakeId]) return;
    
    setLoadingId(sweepstakeId);
    try {
      await supabase.from('sweepstake_participants').insert([{
        sweepstake_id: sweepstakeId,
        user_id: deviceId
      }]);
      setParticipating(prev => ({ ...prev, [sweepstakeId]: true }));
      alert("🎉 Sucesso! Seu nome (Dispositivo) está na urna virtual. Boa sorte!");
    } catch (e) {
      console.error(e);
      alert("Erro ao entrar no sorteio.");
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
        <p>Carregando prêmios e promoções...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <section className="bg-brand-primary pt-12 pb-8 px-4 rounded-b-[2rem] text-brand-text relative shadow-sm overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Prêmios & Ofertas</h1>
            <p className="text-brand-text/80 text-sm">Sorteios e campanhas ativas</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Gift className="w-6 h-6 text-brand-text" />
          </div>
        </div>
      </section>

      {/* Seção de Sorteios (Sweepstakes) */}
      <section className="px-4 mt-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Sorteios Patrocinados</h2>
        </div>

        {sweepstakes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
              <Ticket className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm">Nenhum sorteio rolando no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sweepstakes.map(sweep => (
              <div key={sweep.id} className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden relative">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sweep.image_url || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80"} alt={sweep.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight">{sweep.title}</h3>
                  </div>
                  {/* Badge Patrocinador */}
                  <div className="absolute top-2 left-2 bg-accent/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase backdrop-blur-md">
                    Oferecimento: {sweep.sponsor_name}
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-slate-600 mb-4">{sweep.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      Sorteio: {new Date(sweep.draw_date).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <button 
                      onClick={() => handleParticipate(sweep.id)}
                      disabled={participating[sweep.id] || loadingId === sweep.id}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                        participating[sweep.id]
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                        : 'bg-brand-primary hover:bg-brand-primary/90 text-brand-text'
                      }`}
                    >
                      {loadingId === sweep.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                       participating[sweep.id] ? <><CheckCircle2 className="w-4 h-4" /> Concorrendo</> :
                       <><Ticket className="w-4 h-4" /> Participar</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção de Campanhas / Cupons */}
      <section className="px-4 mt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-slate-900">Cupons e Promoções</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm mb-6">
            <p className="text-slate-500 text-sm">Nenhuma promoção ativa hoje.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {campaigns.map(camp => (
              <div key={camp.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={camp.image_url} alt={camp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{camp.businesses?.name}</span>
                  <h3 className="font-bold text-slate-900 leading-tight mb-1">{camp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{camp.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
