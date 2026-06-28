"use client";

import { useEffect, useState } from "react";
import { Phone, Cross, ShieldAlert, HeartPulse, Stethoscope, AlertTriangle, Loader2, Ship, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

const IconMap: Record<string, any> = {
  Phone, Cross, ShieldAlert, HeartPulse, Stethoscope, AlertTriangle, Ship, MapPin
};

export default function UtilidadesPage() {
  const [utilities, setUtilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('utilities').select('*').order('created_at', { ascending: true });
      if (data) setUtilities(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const emergencias = utilities.filter(u => u.type === 'emergencia');
  const farmacias = utilities.filter(u => u.type === 'farmacia');
  const transportes = utilities.filter(u => u.type === 'transporte');

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <section className="bg-brand-primary pt-12 pb-16 px-4 rounded-b-[2.5rem] text-brand-text text-center shadow-sm relative">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
          <ShieldAlert className="w-6 h-6 text-brand-text" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Utilidade Pública</h1>
        <p className="text-brand-text/80 text-sm max-w-[80%] mx-auto">
          Telefones de emergência e plantões da nossa cidade.
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
          <p>Carregando utilidades...</p>
        </div>
      ) : (
        <>
          {/* Telefones de Emergência */}
          {emergencias.length > 0 && (
            <section className="px-4 -mt-6 relative z-10">
              <h2 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Emergência
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emergencias.map(item => {
                  const IconComp = IconMap[item.icon] || AlertTriangle;
                  return (
                    <a key={item.id} href={`tel:${item.info.replace(/\D/g, '')}`} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 transition-colors group animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                        {item.subtitle && <p className="text-sm text-slate-500">{item.subtitle}</p>}
                      </div>
                      <div className="text-red-600 font-bold text-xl px-2">{item.info}</div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Plantão de Farmácias */}
          {farmacias.length > 0 && (
            <section className="px-4 mt-8">
              <h2 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center">
                <Cross className="w-5 h-5 mr-2 text-emerald-500" />
                Plantão de Farmácias
              </h2>
              
              <div className="space-y-4">
                {farmacias.map(item => {
                  const IconComp = IconMap[item.icon] || Stethoscope;
                  return (
                    <div key={item.id} className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 shadow-sm animate-fade-in">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          {item.subtitle && (
                            <div className="inline-block px-2 py-1 bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                              {item.subtitle}
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                          
                          <a href={`tel:${item.info.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 mt-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                            <Phone className="w-4 h-4" /> Ligar: {item.info}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Transporte */}
          {transportes.length > 0 && (
            <section className="px-4 mt-8 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center">
                <Ship className="w-5 h-5 mr-2 text-blue-500" />
                Horários de Transporte
              </h2>
              <div className="space-y-3">
                {transportes.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-fade-in">
                    <p className="text-sm font-bold text-slate-800 mb-1">{item.title}</p>
                    {item.subtitle && <p className="text-xs text-slate-500 mb-3">{item.subtitle}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.info.split(' ').map((hora, idx) => (
                        hora.trim() !== '' && (
                          <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm border border-slate-200">
                            {hora}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {emergencias.length === 0 && farmacias.length === 0 && transportes.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              Nenhuma utilidade pública cadastrada.
            </div>
          )}
        </>
      )}
    </div>
  );
}
