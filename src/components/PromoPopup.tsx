"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já viu o popup hoje
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem('salinas_popup_last_seen');

    if (lastSeen !== today) {
      // Delay de 2 segundos antes de abrir para não assustar o usuário
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Marca como visto hoje
    localStorage.setItem('salinas_popup_last_seen', new Date().toDateString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-slide-up">
        {/* Botão de Fechar flutuante */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagem do Popup */}
        <div className="h-64 relative bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" 
            alt="Promoção Especial" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
              Patrocinado
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">
              Festival de Frutos do Mar
            </h2>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 text-center">
          <p className="text-slate-600 text-sm mb-6">
            Neste final de semana no Restaurante Mar e Sol. Mostre este app e ganhe 15% de desconto!
          </p>
          
          <Link href="/guia" onClick={handleClose} className="block w-full py-3 bg-brand-primary text-brand-text font-bold rounded-xl hover:bg-brand-primary/90 transition-colors shadow-sm mb-3">
            Ver Restaurantes
          </Link>
          <button onClick={handleClose} className="text-sm font-medium text-slate-400 hover:text-slate-600">
            Agora não, obrigado
          </button>
        </div>
      </div>
    </div>
  );
}
