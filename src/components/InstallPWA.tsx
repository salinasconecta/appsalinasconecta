"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado (standalone)
    const isAppMode = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    
    setIsStandalone(isAppMode);

    if (isAppMode) return; // Se já estiver instalado, não faz nada

    // Detecta iOS para dar instruções específicas (iOS não suporta botão de instalar automático)
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // No iOS, mostramos o banner de instruções após 3 segundos
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Para Android/Chrome: Captura o evento nativo de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col gap-3 animate-in slide-in-from-bottom-5">
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
          SC
        </div>
        <div>
          <h3 className="font-bold text-slate-900 leading-tight">Instalar App</h3>
          <p className="text-xs text-slate-500 mt-0.5">Acesso rápido e offline</p>
        </div>
      </div>
      
      {isIOS ? (
        <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700">
          Para instalar no iPhone: toque no ícone de <strong>Compartilhar</strong> (quadrado com seta) na barra do navegador e depois em <strong>"Adicionar à Tela de Início"</strong>.
        </div>
      ) : (
        <button 
          onClick={handleInstallClick}
          className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5" /> Baixar Aplicativo Agora
        </button>
      )}
    </div>
  );
}
