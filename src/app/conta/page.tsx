"use client";

import { useEffect, useState } from "react";
import { User, Settings, Heart, MapPin, Store, Trophy, Star, ChevronRight, Loader2, Info, Edit3, X, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    phone: ''
  });

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
        setFormData({
          full_name: existingProfile.full_name || 'Explorador Conecta',
          address: existingProfile.address || '',
          phone: existingProfile.phone || ''
        });
      } else {
        // Criar perfil zerado para este novo visitante
        const newProfile = {
          id: deviceId,
          full_name: 'Explorador Conecta',
          points: 0,
          level_name: 'Iniciante',
          address: '',
          phone: ''
        };
        await supabase.from('user_profiles').insert([newProfile]);
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name,
          address: '',
          phone: ''
        });
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

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: formData.full_name,
        address: formData.address,
        phone: formData.phone
      })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, ...formData });
      setIsEditModalOpen(false);
    } else {
      alert("Erro ao salvar perfil");
    }
    setSaving(false);
  };

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
             <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}&backgroundColor=b6e3f4`} 
              alt="Avatar do Usuário" 
              className="w-full h-full object-cover"
            />
            {/* Badge de Nível sobreposta na foto */}
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] font-bold py-0.5">
              Lv. {profile.points < 100 ? 1 : profile.points < 300 ? 2 : 3}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
            <button onClick={() => setIsEditModalOpen(true)} className="text-brand-primary hover:bg-brand-primary/10 p-1.5 rounded-full transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          {(profile.address || profile.phone) && (
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 font-medium mb-3 mt-1">
              {profile.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.address}</span>}
              {profile.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>}
            </div>
          )}
          
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

      {/* Modal de Editar Perfil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Editar Perfil</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex justify-center mb-2">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-brand-primary/20">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.full_name || 'Explorador'}&backgroundColor=b6e3f4`} alt="Avatar Preview" className="w-full h-full" />
                 </div>
              </div>
              <p className="text-[10px] text-center text-slate-400 -mt-3 mb-4 uppercase tracking-wider font-bold">O Avatar muda de acordo com o nome</p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Seu Nome</label>
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm" placeholder="Como quer ser chamado?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Endereço / Bairro</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm" placeholder="Onde você mora?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm" placeholder="(75) 9..." />
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button onClick={handleSaveProfile} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 font-bold text-brand-text bg-brand-primary hover:bg-brand-primary/90 rounded-xl transition-colors shadow-sm disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
