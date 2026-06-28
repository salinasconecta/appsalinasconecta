"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Edit, Trash2, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCampanhas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    business_id: '',
    image_url: '',
    is_active: true
  });

  const fetchData = async () => {
    setLoading(true);
    // Fetch businesses para o select
    const { data: busData } = await supabase.from('businesses').select('id, name');
    if (busData) setBusinesses(busData);

    // Fetch campaigns
    const { data: campData, error } = await supabase
      .from('campaigns')
      .select('*, businesses(name)')
      .order('created_at', { ascending: false });
      
    if (!error && campData) {
      setCampaigns(campData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (campaign?: any) => {
    if (campaign) {
      setEditingId(campaign.id);
      setFormData({
        title: campaign.title,
        business_id: campaign.business_id || '',
        image_url: campaign.image_url || '',
        is_active: campaign.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        business_id: businesses.length > 0 ? businesses[0].id : '',
        image_url: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      await supabase.from('campaigns').delete().eq('id', id);
      fetchData();
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      alert("Título e Imagem são obrigatórios!");
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await supabase.from('campaigns').update(formData).eq('id', editingId);
      } else {
        await supabase.from('campaigns').insert([formData]);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Erro ao salvar campanha");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campanhas e Destaques</h1>
          <p className="text-slate-500 text-sm">Gerencie os banners promocionais que aparecem na Home do aplicativo.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-brand-text font-bold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nova Campanha
        </button>
      </div>

      {loading ? (
        <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          Nenhuma campanha encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${!camp.is_active ? 'opacity-70' : ''}`}>
              <div className="h-32 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {camp.image_url && (
                  <img 
                    src={camp.image_url} 
                    alt={camp.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 text-white text-[10px] font-bold rounded uppercase tracking-wider ${camp.is_active ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                  {camp.is_active ? 'Ativa' : 'Inativa'}
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{camp.title}</h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {camp.businesses?.name || 'Sem Lojista'}
                </p>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button onClick={() => handleOpenModal(camp)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(camp.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Editar Campanha' : 'Nova Campanha'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Título da Campanha</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: Queima de Estoque" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Lojista Vinculado (Opcional)</label>
                  <select value={formData.business_id} onChange={e => setFormData({...formData, business_id: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300">
                    <option value="">Selecione o Lojista...</option>
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">URL da Imagem Banner</label>
                  <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="https://..." />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Campanha Ativa imediatamente</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 font-bold text-brand-text bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Salvar Campanha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
