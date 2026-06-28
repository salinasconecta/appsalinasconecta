import { Lock } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative z-50">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Acesso Restrito</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Área exclusiva para administradores do Salinas Conecta.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="admin@salinas.ba.gov.br"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="button" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors mt-4"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}
