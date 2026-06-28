"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// O React Leaflet precisa ser carregado dinamicamente no Next.js pois depende do objeto 'window'
const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-2" />
      <p>Carregando mapa de Salinas...</p>
    </div>
  ),
});

export function MapWrapper({ businesses }: { businesses: any[] }) {
  return <DynamicMap businesses={businesses} />;
}
