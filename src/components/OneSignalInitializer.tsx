"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInitializer() {
  useEffect(() => {
    // Registra o Service Worker do PWA nativamente (seguro no client-side)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW fail:', err));
    }

    async function initOneSignal() {
      if (!window.OneSignal) {
        try {
          await OneSignal.init({
            appId: "f055ccc8-13e4-467f-940b-912185ea0607",
            safari_web_id: "",
            notifyButton: {
              enable: true,
            },
            allowLocalhostAsSecureOrigin: true,
          });
        } catch (error) {
          // Apenas loga o erro silenciosamente no console para não quebrar a tela vermelha do Next.js
          console.warn("OneSignal Web Push não configurado totalmente no painel ou bloqueado no localhost.");
        }
      }
    }
    
    initOneSignal();
  }, []);

  return null; // Este componente não renderiza nada visualmente por padrão
}
