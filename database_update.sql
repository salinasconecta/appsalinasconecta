-- 1. CRIAR TABELAS DA FASE 3 (Sorteios e Enquetes)
CREATE TABLE IF NOT EXISTS public.sweepstakes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  sponsor_name text NOT NULL,
  end_date timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.polls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  options jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. CORREÇÃO DE SEGURANÇA (RLS) - LIBERAR O PAINEL ADMIN
-- Como ainda não implementamos um sistema de login real (com e-mail e senha de verdade no Supabase),
-- o aplicativo bloqueava silenciosamente suas tentativas de salvar, pois você era um usuário "Anônimo".
-- Para o protótipo funcionar perfeitamente, vamos liberar o acesso total.

DROP POLICY IF EXISTS "Admin All Access App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admin All Access Categorias" ON public.categories;
DROP POLICY IF EXISTS "Admin All Access Businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admin All Access History" ON public.history_articles;

-- Cria políticas liberando leitura, inserção, atualização e exclusão para todas as tabelas:
CREATE POLICY "Acesso Total App Settings" ON public.app_settings FOR ALL USING (true);
CREATE POLICY "Acesso Total Categorias" ON public.categories FOR ALL USING (true);
CREATE POLICY "Acesso Total Businesses" ON public.businesses FOR ALL USING (true);
CREATE POLICY "Acesso Total History" ON public.history_articles FOR ALL USING (true);

ALTER TABLE public.sweepstakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Total Sweepstakes" ON public.sweepstakes FOR ALL USING (true);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Total Polls" ON public.polls FOR ALL USING (true);
