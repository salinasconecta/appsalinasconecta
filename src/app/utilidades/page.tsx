import { Phone, Cross, ShieldAlert, HeartPulse, Stethoscope, AlertTriangle } from "lucide-react";

export default function UtilidadesPage() {
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

      {/* Telefones de Emergência */}
      <section className="px-4 -mt-6 relative z-10">
        <h2 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Emergência
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Card Polícia */}
          <a href="tel:190" className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Polícia Militar</h3>
              <p className="text-sm text-slate-500">Viaturas e Segurança</p>
            </div>
            <div className="text-blue-600 font-bold text-xl px-2">190</div>
          </a>

          {/* Card SAMU */}
          <a href="tel:192" className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">SAMU</h3>
              <p className="text-sm text-slate-500">Ambulância e Resgate</p>
            </div>
            <div className="text-red-600 font-bold text-xl px-2">192</div>
          </a>

          {/* Card Bombeiros */}
          <a href="tel:193" className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Bombeiros</h3>
              <p className="text-sm text-slate-500">Incêndios e Defesa Civil</p>
            </div>
            <div className="text-orange-500 font-bold text-xl px-2">193</div>
          </a>
        </div>
      </section>

      {/* Plantão de Farmácias */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center">
          <Cross className="w-5 h-5 mr-2 text-emerald-500" />
          Plantão de Farmácias (Hoje)
        </h2>
        
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-block px-2 py-1 bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                Aberta até 22h
              </div>
              <h3 className="text-lg font-bold text-slate-900">Farmácia Central</h3>
              <p className="text-sm text-slate-600 mb-3">Praça da Matriz, Centro - Salinas da Margarida</p>
              
              <a href="tel:7599999999" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                <Phone className="w-4 h-4" /> Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Transporte */}
      <section className="px-4 mt-8 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3 px-2">Horários de Lanchas</h2>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Saída de Salinas para Salvador (Terminal Marítimo):</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm">05:30</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm">08:00</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm">13:00</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm">16:30</span>
          </div>
        </div>
      </section>
    </div>
  );
}
