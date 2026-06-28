import { Search, Tag, ArrowRight, Store, Utensils, HeartPulse, Briefcase, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { WeatherWidget } from "@/components/WeatherWidget";
import { PromoPopup } from "@/components/PromoPopup";
import { PollWidget } from "@/components/PollWidget";

// Mapeamento de ícones do banco para componentes React
const IconMap: Record<string, any> = {
  Utensils: Utensils,
  HeartPulse: HeartPulse,
  Briefcase: Briefcase,
  ShoppingBasket: ShoppingBasket,
  Store: Store,
};

export default async function Home() {
  // Buscar Textos Globais
  const { data: settingsData } = await supabase.from('app_settings').select('key, value');
  const settings: Record<string, string> = {};
  if (settingsData) {
    settingsData.forEach(s => { settings[s.key] = s.value; });
  }

  // Buscar Categorias
  const { data: categories } = await supabase.from('categories').select('*').order('created_at');

  // Buscar Campanhas Ativas
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, businesses(name, is_open)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-8 bg-brand-primary text-brand-text rounded-b-[2rem] shadow-sm overflow-hidden">
        <PromoPopup />
        <div className="relative z-10 animate-fade-in">
          <header className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm font-medium opacity-80">{settings['home_greeting'] || 'Bem-vindo a'}</p>
              <h1 className="text-2xl font-bold tracking-tight text-brand-text">
                {settings['home_title'] || 'Salinas da Margarida'}
              </h1>
            </div>
            <WeatherWidget />
          </header>

          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="w-full h-14 pl-12 pr-4 bg-brand-surface rounded-2xl border-none shadow-lg text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary outline-none text-base"
              placeholder={settings['home_search_placeholder'] || "O que você está procurando?"}
            />
          </div>
        </div>
      </section>

      {/* Categorias Rápidas */}
      <section className="px-4 mt-8 animate-slide-up">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-slate-900">Explorar Categorias</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {categories?.map((cat) => {
            const IconCmp = IconMap[cat.icon_name] || Store;
            return (
              <Link href={`/guia?categoria=${cat.slug}`} key={cat.id} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <IconCmp className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-slate-600">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destaques Locais (Campanhas) */}
      <section className="px-4 mt-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-slate-900">Destaques Locais</h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((camp) => (
              <div key={camp.id} className="min-w-[280px] h-48 rounded-2xl glass-card overflow-hidden relative group shrink-0 shadow-sm border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={camp.image_url} 
                  alt={camp.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white backdrop-blur-md border border-white/20 ${camp.businesses?.is_open ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}>
                    {camp.businesses?.is_open ? 'Aberto Agora' : 'Fechado'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-white mb-1">{camp.title}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {camp.businesses?.name || 'Local Especial'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full p-6 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
              Nenhuma campanha ativa no momento.
            </div>
          )}
        </div>
        
        {/* Enquete em Tempo Real */}
        <PollWidget />
      </section>

      {/* Banner História */}
      <section className="px-4 mt-6 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Link href="/historia" className="block">
          <div className="w-full rounded-2xl bg-brand-soft p-5 shadow-sm relative overflow-hidden group border border-brand-primary/30">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-brand-text mb-1">Salinas Histórica</h2>
              <p className="text-sm text-brand-text/80 mb-4 max-w-[70%]">Descubra a memória, cultura e turismo do nosso município.</p>
              <div className="inline-flex items-center text-xs font-bold text-brand-surface bg-brand-text px-3 py-1.5 rounded-full transition-colors">
                Explorar Agora <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
