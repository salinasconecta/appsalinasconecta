"use client";

import { useEffect, useState } from "react";
import { PieChart, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PollWidget() {
  const [poll, setPoll] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem('guest_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guest_device_id', id);
    }
    setDeviceId(id);

    async function loadPoll() {
      // Pega a primeira enquete ativa
      const { data: pData } = await supabase.from('polls').select('*').eq('active', true).limit(1).single();
      
      if (pData) {
        setPoll(pData);
        // Busca opções
        const { data: optData } = await supabase.from('poll_options').select('*').eq('poll_id', pData.id);
        if (optData) setOptions(optData);
        
        // Busca votos totais dessa enquete
        const { data: vData } = await supabase.from('poll_votes').select('*').eq('poll_id', pData.id);
        if (vData) {
          setVotes(vData);
          // Verifica se EU já votei
          if (vData.some(v => v.user_id === id)) {
            setHasVoted(true);
          }
        }
      } else {
        // --- SEED DE TESTE AUTOMÁTICO ---
        // Se não existir enquete, vamos criar uma de teste só para ver funcionando!
        const { data: newPoll } = await supabase.from('polls').insert([{ question: 'Qual a sua praia favorita em Salinas?' }]).select().single();
        if (newPoll) {
          await supabase.from('poll_options').insert([
            { poll_id: newPoll.id, option_text: 'Praia da Ponte' },
            { poll_id: newPoll.id, option_text: 'Praia do Amor' },
            { poll_id: newPoll.id, option_text: 'Praia de Cairu' }
          ]);
          // Recarrega a página para puxar os dados criados
          window.location.reload();
        }
      }
      setLoading(false);
    }

    loadPoll();

    // Inscrição em tempo real para os Votos (Magia do Supabase)
    const subscription = supabase
      .channel('public:poll_votes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, payload => {
        setVotes(current => [...current, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleVote = async (optionId: string) => {
    if (hasVoted) return;
    
    // UI Otimista
    setHasVoted(true);
    setVotes(prev => [...prev, { poll_id: poll.id, option_id: optionId, user_id: deviceId }]);
    
    // Grava no banco
    await supabase.from('poll_votes').insert([{
      poll_id: poll.id,
      option_id: optionId,
      user_id: deviceId
    }]);
  };

  if (loading) return null;
  if (!poll) return null;

  const totalVotes = votes.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mt-6 relative overflow-hidden group">
      {/* Decoração */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center opacity-50">
        <PieChart className="w-8 h-8 text-blue-300 transform rotate-12" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          Enquete da Comunidade
        </span>
      </div>
      
      <h3 className="font-bold text-slate-900 text-lg mb-4">{poll.question}</h3>

      <div className="space-y-3 relative z-10">
        {options.map(opt => {
          const optionVotes = votes.filter(v => v.option_id === opt.id).length;
          const percentage = totalVotes === 0 ? 0 : Math.round((optionVotes / totalVotes) * 100);
          
          return (
            <div key={opt.id} className="relative">
              <button 
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`w-full relative z-10 flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all text-left
                  ${hasVoted ? 'border-transparent text-slate-700' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700'}
                `}
              >
                <span className="truncate pr-4">{opt.option_text}</span>
                {hasVoted && (
                  <span className="font-bold text-slate-900 shrink-0">{percentage}%</span>
                )}
              </button>
              
              {/* Barra de Progresso Visível Apenas Após Votar */}
              {hasVoted && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-100 rounded-xl transition-all duration-1000 ease-out z-0"
                  style={{ width: `${percentage}%` }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Voto computado</span>
          <span>{totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}</span>
        </div>
      )}
    </div>
  );
}
