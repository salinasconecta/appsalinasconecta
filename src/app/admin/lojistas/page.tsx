"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Store, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLojistas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    whatsapp_number: '',
    image_url: '',
    description: '',
    is_open: true
  });

  const fetchData = async () => {
    setLoading(true);
    // Fetch categorias
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    // Fetch lojistas
    const { data: busData, error } = await supabase
      .from('businesses')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
      
    if (!error && busData) {
      setBusinesses(busData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (business?: any) => {
    if (business) {
      setEditingId(business.id);
      setFormData({
        name: business.name,
        category_id: business.category_id || '',
        whatsapp_number: business.whatsapp_number || '',
        image_url: business.image_url || '',
        description: business.description || '',
        is_open: business.is_open
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        whatsapp_number: '',
        image_url: '',
        description: '',
        is_open: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este lojista?")) {
      await supabase.from('businesses').delete().eq('id', id);
      fetchData();
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category_id) {
      alert("Nome e Categoria são obrigatórios!");
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await supabase.from('businesses').update(formData).eq('id', editingId);
      } else {
        await supabase.from('businesses').insert([formData]);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lojistas (Guia Comercial)</h1>
          <p className="text-slate-500 text-sm">Gerencie os comércios e estabelecimentos cadastrados no app.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-brand-text font-bold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Novo Lojista
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar estabelecimento por nome..." 
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        <select className="border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
          <option value="">Todas as Categorias</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : businesses.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Nenhum lojista encontrado.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Estabelecimento</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {businesses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{bus.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{bus.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{bus.categories?.name || 'Sem Categoria'}</td>
                  <td className="px-6 py-4">
                    {bus.is_open ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Aberto</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">Fechado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(bus)} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(bus.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Editar Lojista' : 'Novo Lojista'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Estabelecimento</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: Padaria Central" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
                    <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300">
                      <option value="">Selecione...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
                    <input type="text" value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="(75) 99999-9999" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">URL da Imagem</label>
                    <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Breve descrição do negócio..."></textarea>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isOpen" checked={formData.is_open} onChange={e => setFormData({...formData, is_open: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <label htmlFor="isOpen" className="text-sm font-medium text-slate-700">Estabelecimento Aberto</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 font-bold text-brand-text bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Salvar Lojista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
