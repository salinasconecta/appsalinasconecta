"use client";

import { useState } from "react";
import { Star, X, Share2, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  deviceId: string;
}

export function ReviewModal({ isOpen, onClose, businessId, businessName, deviceId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return alert("Por favor, dê uma nota de 1 a 5 estrelas.");
    
    setLoading(true);
    try {
      await supabase.from('reviews').insert([{
        business_id: businessId,
        user_id: deviceId,
        rating: rating,
        comment: comment
      }]);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const text = `Dei ${rating} estrelas para "${businessName}" no app Salinas Conecta! 🌟 Venha conhecer o Guia Comercial de Salinas!`;
    const url = "https://salinasconecta.github.io/appsalinasconecta";

    // Usa a API Nativa de Compartilhamento do Celular (Abre Zap, Insta, etc)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Avaliação no Salinas Conecta',
          text: text,
          url: url
        });
      } catch (err) {
        console.log("Compartilhamento cancelado", err);
      }
    } else {
      // Fallback para quem está no PC
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-slide-up p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 fill-amber-500" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">Avalie sua Experiência</h2>
            <p className="text-sm text-slate-500 mb-6">Como foi o seu atendimento em <br/><span className="font-bold text-brand-primary">{businessName}</span>?</p>

            {/* Estrelas */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? "fill-amber-400 text-amber-400" 
                        : "fill-slate-100 text-slate-200"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Deixe um comentário (opcional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 rounded-xl p-3 outline-none text-sm text-slate-700 resize-none h-24 border border-slate-200 focus:border-brand-primary/50 transition-colors mb-6"
            />

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brand-primary text-brand-text font-bold py-3.5 rounded-xl shadow-sm hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Enviando..." : <><Send className="w-4 h-4" /> Enviar Avaliação</>}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center mt-4 py-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <MessageCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-2">Muito Obrigado!</h2>
            <p className="text-sm text-slate-500 mb-6">Sua avaliação ajuda a comunidade de Salinas a encontrar os melhores lugares!</p>

            <button 
              onClick={handleShare}
              className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-[#20b858] transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Share2 className="w-4 h-4" /> Compartilhar Nota
            </button>
            
            <button 
              onClick={onClose}
              className="w-full bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
