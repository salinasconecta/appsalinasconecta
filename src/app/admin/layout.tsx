import Link from "next/link";
import { LayoutDashboard, Users, Tag, BookOpen, Settings, LogOut, Trophy, PieChart, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar / Topbar para Mobile */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-200">
          <h1 className="font-bold text-xl text-primary">Admin CMS</h1>
          <p className="text-xs text-slate-500">Salinas Conecta</p>
        </div>
        
        <nav className="p-4 space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </Link>
          <Link href="/admin/lojistas" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <Users className="w-4 h-4" /> Lojistas
          </Link>
          <Link href="/admin/campanhas" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <Tag className="w-4 h-4" /> Campanhas
          </Link>
          <Link href="/admin/historia" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <BookOpen className="w-4 h-4" /> História & Turismo
          </Link>
          <Link href="/admin/sorteios" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-amber-100 text-amber-700">
            <Trophy className="w-4 h-4" /> Sorteios
          </Link>
          <Link href="/admin/enquetes" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-100 text-blue-700">
            <PieChart className="w-4 h-4" /> Enquetes
          </Link>
          <Link href="/admin/utilidades" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-emerald-100 text-emerald-700">
            <ShieldAlert className="w-4 h-4" /> Utilidade Pública
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <Settings className="w-4 h-4" /> Textos do App
          </Link>
          
          <div className="mt-8 pt-4 border-t border-slate-200 hidden md:block">
            <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-50 text-red-600">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
