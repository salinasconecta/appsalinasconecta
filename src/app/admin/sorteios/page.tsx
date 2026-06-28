"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";

export default function AdminSorteios() {
  const [sweepstakes, setSweepstakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [title, setTitle] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [drawDate, setDrawDate] = useState("");
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase.from('sweepstakes').select('*').order('created_at', { ascending: false });
    if (data) setSweepstakes(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('sweepstakes').insert([{
      title, sponsor_name: sponsorName, description, image_url: imageUrl, draw_date: new Date(drawDate).toISOString()
    }]);
    
    if (error) alert("Erro: " + error.message);
    else {
      setTitle(""); setSponsorName(""); setDescription(""); setImageUrl(""); setDrawDate("");
      loadData();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este sorteio?")) return;
    await supabase.from('sweepstakes').delete().eq('id', id);
    loadData();
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Sorteios Patrocinados</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold mb-4">Novo Sorteio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input required type="text" placeholder="Título (Ex: Combo de Lanche)" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl p-3" />
          <input required type="text" placeholder="Nome do Patrocinador" value={sponsorName} onChange={e => setSponsorName(e.target.value)} className="w-full border rounded-xl p-3" />
          <input required type="text" placeholder="URL da Imagem (Opcional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded-xl p-3" />
          <input required type="datetime-local" placeholder="Data do Sorteio" value={drawDate} onChange={e => setDrawDate(e.target.value)} className="w-full border rounded-xl p-3" />
          <textarea placeholder="Regras ou Descrição" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-xl p-3 md:col-span-2 h-24" />
        </div>
        
        <button disabled={submitting} className="bg-brand-primary text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Adicionar Sorteio
        </button>
      </form>

      <div className="space-y-4">
        {sweepstakes.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
                {s.image_url && <img src={s.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500">Patrocínio: {s.sponsor_name}</p>
                <p className="text-xs text-brand-primary flex items-center gap-1 mt-1"><Calendar className="w-3 h-3"/> Data: {new Date(s.draw_date).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
