import { Store, Tag, BookOpen, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Visão Geral</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Lojistas Ativos</p>
            <p className="text-2xl font-bold mt-1">24</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Store className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Campanhas</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Tag className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Artigos Históricos</p>
            <p className="text-2xl font-bold mt-1">8</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Usuários B2B</p>
            <p className="text-2xl font-bold mt-1">15</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Bem-vindo ao Painel CMS</h2>
        <p className="text-slate-600 mb-4">
          Este painel permite que você gerencie todos os dados do aplicativo Salinas Conecta sem precisar alterar o código-fonte.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
          <li><strong>Textos do App:</strong> Altere títulos, subtítulos e textos soltos espalhados pelas telas.</li>
          <li><strong>Lojistas:</strong> Cadastre novos comércios, categorias e gerencie quem pode editar seus perfis.</li>
          <li><strong>História & Turismo:</strong> Adicione novos pontos turísticos, textos literários e fotos.</li>
        </ul>
      </div>
    </div>
  );
}
