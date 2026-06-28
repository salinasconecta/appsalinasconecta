"use client";

import { useEffect, useState } from "react";
import { User, Settings, Heart, MapPin, Store, Trophy, Star, ChevronRight, Loader2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      // Criação de um ID de dispositivo falso temporário para simular login sem precisar de tela de senha
      let deviceId = localStorage.getItem('guest_device_id');
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('guest_device_id', deviceId);
      }

      // Buscar perfil
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Criar perfil zerado para este novo visitante
        const newProfile = {
          id: deviceId,
          full_name: 'Explorador Conecta',
          points: 0,
          level_name: 'Iniciante'
        };
        await supabase.from('user_profiles').insert([newProfile]);
        setProfile(newProfile);
      }

      // Buscar quantidade de favoritos
      const { count } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', deviceId)
        .eq('interaction_type', 'favorite');
        
      setFavoritesCount(count || 0);
      setLoading(false);
    }
    
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Cálculos de nível (Gamificação Simples)
  const nextLevelPoints = profile.points < 100 ? 100 : profile.points < 300 ? 300 : profile.points < 1000 ? 1000 : 5000;
  const progressPercent = Math.min(100, (profile.points / nextLevelPoints) * 100);

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header do Perfil (Com Gamificação) */}
      <section className="bg-brand-primary pt-12 pb-24 px-4 rounded-b-[2rem] text-brand-text text-center relative shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Meu Perfil</h1>
        <p className="text-brand-text/80 text-sm">Acompanhe seu progresso na cidade</p>
      </section>

      {/* Card Principal do Usuário (Sobreposto) */}
      <section className="px-4 -mt-16 relative z-10 animate-fade-in">
        <div className="bg-brand-surface rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-brand-primary/20">
          <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-brand-surface -mt-16 mb-3 flex items-center justify-center relative overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}&backgroundColor=b6e3f4`} 
              alt="Avatar do Usuário" 
              className="w-full h-full object-cover"
            />
            {/* Badge de Nível sobreposta na foto */}
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] font-bold py-0.5">
              Lv. {profile.points < 100 ? 1 : profile.points < 300 ? 2 : 3}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
          
          <div className="flex items-center gap-1 text-amber-500 font-bold mb-4 mt-1 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <Trophy className="w-4 h-4" />
            <span>{profile.points} Pontos Conecta</span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1 overflow-hidden">
            <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 w-full text-left font-medium">
            Faltam {nextLevelPoints - profile.points} pontos para o próximo nível
          </p>
        </div>
      </section>

      {/* Menu Principal */}
      <section className="px-4 mt-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Bloco Gamificação & Social */}
        <div className="bg-brand-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Meu Engajamento
          </div>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p>Lugares Salvos</p>
                <p className="text-xs text-slate-400 font-normal">{favoritesCount} favoritos</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p>Meus Check-ins</p>
                <p className="text-xs text-slate-400 font-normal">Histórico de visitas</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Missões e Recompensas */}
        <div className="bg-gradient-to-r from-brand-soft to-brand-surface p-5 rounded-2xl border border-brand-primary/20 shadow-sm relative overflow-hidden group cursor-pointer">
          <div className="absolute right-0 top-0 opacity-10 text-brand-primary transform translate-x-4 -translate-y-4">
             <Trophy className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Missão Diária</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Faça um Check-in hoje</h3>
            <p className="text-xs text-slate-600 mb-3 max-w-[80%]">Visite qualquer estabelecimento parceiro e ganhe +20pts extras.</p>
            <span className="text-sm font-bold text-brand-primary flex items-center gap-1 group-hover:underline">
              Ver lojas no mapa <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

      </section>
    </div>
  );
}
