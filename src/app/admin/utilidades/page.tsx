"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit2, Trash2, X, AlertTriangle } from "lucide-react";

export default function AdminUtilidadesPage() {
  const [utilities, setUtilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'emergencia',
    title: '',
    subtitle: '',
    info: '',
    icon: 'Phone'
  });

  useEffect(() => {
    loadUtilities();
  }, []);

  async function loadUtilities() {
    setLoading(true);
    const { data } = await supabase.from('utilities').select('*').order('created_at', { ascending: false });
    if (data) setUtilities(data);
    setLoading(false);
  }

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        type: item.type,
        title: item.title,
        subtitle: item.subtitle || '',
        info: item.info,
        icon: item.icon || 'Phone'
      });
    } else {
      setEditingId(null);
      setFormData({
        type: 'emergencia',
        title: '',
        subtitle: '',
        info: '',
        icon: 'Phone'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editingId) {
      await supabase.from('utilities').update(formData).eq('id', editingId);
    } else {
      await supabase.from('utilities').insert([formData]);
    }
    await loadUtilities();
    setIsModalOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      await supabase.from('utilities').delete().eq('id', id);
      loadUtilities();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Utilidade Pública</h1>
          <p className="text-slate-500 text-sm">Gerencie telefones de emergência, plantões e horários.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Item
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Tipo</th>
                <th className="p-4 font-bold">Título</th>
                <th className="p-4 font-bold">Info Principal</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {utilities.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                      ${item.type === 'emergencia' ? 'bg-red-100 text-red-700' : 
                        item.type === 'farmacia' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-blue-100 text-blue-700'}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    {item.subtitle && <p className="text-xs text-slate-500">{item.subtitle}</p>}
                  </td>
                  <td className="p-4 font-medium text-slate-700">{item.info}</td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-brand-primary bg-slate-100 hover:bg-brand-primary/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {utilities.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Nenhum item cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Editar Item' : 'Novo Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Utilidade</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                >
                  <option value="emergencia">Emergência</option>
                  <option value="farmacia">Plantão de Farmácia</option>
                  <option value="transporte">Transporte (Lanchas)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Título</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: Polícia Militar, Farmácia Central..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subtítulo (Opcional)</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: Viaturas e Segurança, Praça da Matriz..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Informação Principal (Telefone ou Horários)
                </label>
                <input type="text" value={formData.info} onChange={e => setFormData({...formData, info: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: 190, 75 9999-9999, ou 05:30 08:00..." />
                <p className="text-xs text-slate-500 mt-1">Para horários de lancha, separe-os por espaço (ex: 05:30 08:00 13:00).</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Ícone Lucide (Opcional)</label>
                <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-300" placeholder="Ex: ShieldAlert, Phone, Cross..." />
                <p className="text-xs text-slate-500 mt-1">Nomes válidos: Phone, ShieldAlert, HeartPulse, Cross, Stethoscope, Ship, MapPin.</p>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving || !formData.title || !formData.info} className="flex items-center gap-2 px-6 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
