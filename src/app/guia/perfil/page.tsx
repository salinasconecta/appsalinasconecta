"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Phone, Store, Loader2, Share2, Camera, Globe } from "lucide-react";

function PerfilContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      supabase.from('businesses').select('*, categories(name)').eq('id', id).single()
        .then(({ data, error }) => {
          if (!error && data) {
            setBusiness(data);
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Store className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Lojista não encontrado</h2>
        <button onClick={() => router.back()} className="mt-6 bg-brand-primary text-white font-bold py-3 px-8 rounded-xl">
          Voltar
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Veja o perfil de ${business.name} no Salinas Conecta!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Imagem de Capa */}
      <div className="relative h-72 w-full bg-slate-200">
        {business.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-primary/10">
            <Store className="w-24 h-24 text-brand-primary/30" />
          </div>
        )}
        
        {/* Gradiente para o texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Botões do Topo */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-md active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleShare}
          className="absolute top-6 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-md active:scale-95 transition-transform"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* Informações Principais */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{business.name}</h1>
              <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mt-1">
                {business.categories?.name || 'Comércio Local'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${business.is_open ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {business.is_open ? 'Aberto Agora' : 'Fechado'}
            </div>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {business.description || 'Este estabelecimento não forneceu uma descrição.'}
          </p>
          
          <div className="flex flex-col gap-3">
            {business.whatsapp_number && (
              <a 
                href={`https://wa.me/55${business.whatsapp_number.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-4 rounded-2xl font-bold transition-colors shadow-sm border border-emerald-100/50"
              >
                <div className="w-10 h-10 bg-emerald-200/50 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                Chamar no WhatsApp
              </a>
            )}
            
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl text-sm font-medium text-slate-700 border border-slate-100">
              <div className="w-10 h-10 bg-slate-200/50 rounded-full flex items-center justify-center flex-shrink-0 text-slate-500">
                <MapPin className="w-5 h-5" />
              </div>
              <p>{business.address || 'Endereço não informado no cadastro.'}</p>
            </div>
            
            {(business.instagram_url || business.facebook_url) && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {business.instagram_url && (
                  <a 
                    href={business.instagram_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-3 rounded-2xl font-bold transition-opacity hover:opacity-90 shadow-sm"
                  >
                    <Camera className="w-5 h-5" />
                    Instagram
                  </a>
                )}
                {business.facebook_url && (
                  <a 
                    href={business.facebook_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-2xl font-bold transition-opacity hover:opacity-90 shadow-sm"
                  >
                    <Globe className="w-5 h-5" />
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerfilLojista() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    }>
      <PerfilContent />
    </Suspense>
  );
}
