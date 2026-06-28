"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function AdminEnquetes() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [question, setQuestion] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase.from('polls').select('*, poll_options(*)').order('created_at', { ascending: false });
    if (data) setPolls(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opt1 || !opt2) return alert("Forneça pelo menos 2 opções.");
    
    setSubmitting(true);
    
    // Inserir Enquete
    const { data: pData, error: pError } = await supabase.from('polls').insert([{ question }]).select().single();
    
    if (pData && !pError) {
      // Inserir Opções
      const ops = [ { poll_id: pData.id, option_text: opt1 }, { poll_id: pData.id, option_text: opt2 } ];
      if (opt3) ops.push({ poll_id: pData.id, option_text: opt3 });
      
      await supabase.from('poll_options').insert(ops);
      
      setQuestion(""); setOpt1(""); setOpt2(""); setOpt3("");
      loadData();
    } else {
      alert("Erro ao criar enquete.");
    }
    
    setSubmitting(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('polls').update({ active: !current }).eq('id', id);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta enquete e todos os votos?")) return;
    await supabase.from('polls').delete().eq('id', id);
    loadData();
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Enquetes da Comunidade</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold mb-4">Nova Enquete</h2>
        <input required type="text" placeholder="Pergunta (Ex: Melhor praia de Salinas?)" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border rounded-xl p-3 mb-4 font-bold" />
        
        <div className="space-y-3 mb-4">
          <input required type="text" placeholder="Opção 1" value={opt1} onChange={e => setOpt1(e.target.value)} className="w-full border rounded-xl p-3 bg-slate-50" />
          <input required type="text" placeholder="Opção 2" value={opt2} onChange={e => setOpt2(e.target.value)} className="w-full border rounded-xl p-3 bg-slate-50" />
          <input type="text" placeholder="Opção 3 (Opcional)" value={opt3} onChange={e => setOpt3(e.target.value)} className="w-full border rounded-xl p-3 bg-slate-50" />
        </div>
        
        <button disabled={submitting} className="bg-brand-primary text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Lançar Enquete
        </button>
      </form>

      <div className="space-y-4">
        {polls.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900 text-lg">{p.question}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(p.id, p.active)} className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.active ? <CheckCircle2 className="w-4 h-4"/> : <Circle className="w-4 h-4"/>} {p.active ? 'Ativa' : 'Inativa'}
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <ul className="space-y-2">
              {p.poll_options?.map((opt: any) => (
                <li key={opt.id} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-sm text-slate-700 flex justify-between">
                  {opt.option_text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
