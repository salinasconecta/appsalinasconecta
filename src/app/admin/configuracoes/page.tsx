"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Buscar configurações ao carregar a página
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('app_settings').select('key, value');
      
      if (error) {
        console.error("Erro ao buscar configurações:", error);
      } else if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
        setSettings(settingsMap);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // Atualizar o estado local
  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  // Salvar no Supabase
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // Como o Supabase não tem "upsert" em massa fácil nativo sem restrições específicas por padrão,
      // vamos fazer um update para cada chave (são poucas).
      const keys = Object.keys(settings);
      for (const key of keys) {
        await supabase
          .from('app_settings')
          .update({ value: settings[key], updated_at: new Date().toISOString() })
          .eq('key', key);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Tira o aviso de salvo após 3s
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Textos Globais</h1>
        
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-600 font-medium flex items-center gap-1 text-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-brand-text font-bold px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
      
      <p className="text-slate-600 mb-8">
        Edite os textos soltos que aparecem pelo aplicativo. As mudanças serão refletidas imediatamente.
      </p>

      <div className="space-y-6 max-w-3xl animate-slide-up">
        {/* Bloco Home */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">Página Inicial (Home)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Saudação do Topo</label>
              <input 
                type="text" 
                value={settings['home_greeting'] || ''} 
                onChange={(e) => handleChange('home_greeting', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título Principal</label>
              <input 
                type="text" 
                value={settings['home_title'] || ''} 
                onChange={(e) => handleChange('home_title', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Barra de Pesquisa (Placeholder)</label>
              <input 
                type="text" 
                value={settings['home_search_placeholder'] || ''} 
                onChange={(e) => handleChange('home_search_placeholder', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bloco História */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">Página de História</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título do Topo (Hero)</label>
              <input 
                type="text" 
                value={settings['historia_hero_title'] || ''} 
                onChange={(e) => handleChange('historia_hero_title', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 font-bold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subtítulo (Descrição)</label>
              <textarea 
                rows={3}
                value={settings['historia_hero_desc'] || ''} 
                onChange={(e) => handleChange('historia_hero_desc', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
