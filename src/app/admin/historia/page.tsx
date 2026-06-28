"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Edit, Trash2, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminHistoria() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'tourism',
    image_url: '',
    description: '',
    content: '',
    is_published: true
  });

  // Fetch dados reais do Supabase
  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('history_articles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar artigos:", error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenModal = (article?: any) => {
    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title,
        type: article.type,
        image_url: article.image_url || '',
        description: article.description,
        content: article.content || '',
        is_published: article.is_published
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        type: 'tourism',
        image_url: '',
        description: '',
        content: '',
        is_published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      const { error } = await supabase.from('history_articles').delete().eq('id', id);
      if (error) {
        alert("Erro ao excluir!");
      } else {
        fetchArticles(); // Recarrega a lista
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Título e Descrição são obrigatórios!");
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        // Atualizar existente
        const { error } = await supabase
          .from('history_articles')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Criar novo
        const { error } = await supabase
          .from('history_articles')
          .insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchArticles(); // Recarrega a lista com os dados novos
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar artigo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">História & Turismo</h1>
          <p className="text-slate-500 text-sm">Gerencie os pontos turísticos e textos literários/históricos da cidade.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-brand-text font-bold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Novo Artigo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Nenhum artigo encontrado. Clique em "Novo Artigo" para começar.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Artigo / Ponto Turístico</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-primary flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{art.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{art.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                       art.type === 'history' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                     }`}>
                       {art.type === 'history' ? 'História' : art.type === 'tourism' ? 'Turismo' : 'Cultura'}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    {art.is_published ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Publicado</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">Rascunho</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(art)} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(art.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Editar Artigo' : 'Novo Artigo / Ponto Turístico'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Título</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      placeholder="Ex: Praia da Ponte" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Conteúdo</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="tourism">Turismo</option>
                      <option value="history">História</option>
                      <option value="culture">Cultura</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">URL da Imagem</label>
                    <input 
                      type="text" 
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      placeholder="https://..." 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Descrição Curta (Resumo)</label>
                    <textarea 
                      rows={2} 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      placeholder="Resumo de 1-2 linhas para o card..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Conteúdo Completo (Texto Literário)</label>
                    <textarea 
                      rows={6} 
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      placeholder="Escreva o texto completo histórico ou descritivo aqui..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="isPublished" 
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" 
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">Publicar imediatamente</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 font-bold text-brand-text bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Salvando...' : 'Salvar Artigo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
