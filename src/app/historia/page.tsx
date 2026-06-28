import { MapPin, BookOpen, Clock, Compass, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function HistoriaPage() {
  // Buscar Textos Globais para a Hero
  const { data: settingsData } = await supabase.from('app_settings').select('key, value');
  const settings: Record<string, string> = {};
  if (settingsData) {
    settingsData.forEach(s => { settings[s.key] = s.value; });
  }

  // Buscar Artigos
  const { data: articles } = await supabase
    .from('history_articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // Separar em turismo e história para a UI
  const turismo = articles?.filter(a => a.type === 'tourism') || [];
  const literatura = articles?.filter(a => a.type === 'history' || a.type === 'culture') || [];

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Histórico */}
      <section className="relative px-4 pt-14 pb-12 bg-brand-primary text-brand-text rounded-b-[2.5rem] shadow-sm overflow-hidden">
        <div className="relative z-10 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center mb-6 shadow-sm border border-brand-primary/20">
            <BookOpen className="w-6 h-6 text-brand-text" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-brand-text">
            {settings['historia_hero_title'] || 'Memória & Turismo'}
          </h1>
          <p className="text-brand-text/80 text-sm leading-relaxed max-w-[90%]">
            {settings['historia_hero_desc'] || 'Mergulhe no acervo cultural e descubra as rotas turísticas de Salinas.'}
          </p>
        </div>
      </section>

      {/* Navegação Rápida (Abas) */}
      <section className="px-4 mt-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-brand-text text-sm font-bold shadow-sm whitespace-nowrap">
            <Compass className="w-4 h-4" /> Rotas e Turismo
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-brand-text/70 text-sm font-medium whitespace-nowrap">
            <Clock className="w-4 h-4" /> Acervo Literário
          </button>
        </div>
      </section>

      {/* Pontos Turísticos */}
      <section className="px-4 mt-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-brand-primary" />
          Lugares Imperdíveis
        </h2>
        
        {turismo.length === 0 ? (
           <div className="p-6 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
             Nenhum ponto turístico cadastrado ainda.
           </div>
        ) : (
          <div className="flex flex-col gap-5">
            {turismo.map((ponto) => (
              <div key={ponto.id} className="glass-card overflow-hidden group cursor-pointer relative border border-slate-100">
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {ponto.image_url && (
                    <img 
                      src={ponto.image_url} 
                      alt={ponto.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1520]/90 via-[#0f1520]/20 to-transparent"></div>
                  
                  {/* Content over image */}
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{ponto.title}</h3>
                    <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                      {ponto.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Artigos em Destaque */}
      <section className="px-4 mt-10 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        {literatura.map((artigo) => (
          <div key={artigo.id} className="p-5 mb-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-bold tracking-wider text-brand-primary uppercase mb-2">Acervo Histórico</div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">{artigo.title}</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3">
              {artigo.content || artigo.description}
            </p>
            <button className="flex items-center text-sm font-bold text-brand-text hover:opacity-80 transition-opacity">
              Ler artigo completo <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
