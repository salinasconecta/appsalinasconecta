-- =======================================================
-- SALINAS CONECTA - SUPABASE SCHEMA (CMS)
-- =======================================================

-- 1. TABELA DE CONFIGURAÇÕES GLOBAIS (Textos do App)
CREATE TABLE public.app_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Inserir dados padrão para Home
INSERT INTO public.app_settings (key, value, description) VALUES
('home_greeting', 'Bem-vindo a', 'Saudação no topo da Home'),
('home_title', 'Salinas da Margarida', 'Nome da cidade no topo da Home'),
('home_search_placeholder', 'O que você está procurando?', 'Placeholder da barra de busca'),
('historia_hero_title', 'Memória & Turismo', 'Título principal da página de História'),
('historia_hero_desc', 'Mergulhe no acervo cultural, descubra as rotas turísticas e conheça a rica história de Salinas da Margarida.', 'Subtítulo da página de História');

-- 2. TABELA DE CATEGORIAS
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon_name text NOT NULL, -- Nome do ícone do Lucide (ex: 'Coffee')
  slug text UNIQUE NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. TABELA DE LOJISTAS (Guia)
CREATE TABLE public.businesses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category_id uuid REFERENCES public.categories(id),
  description text,
  image_url text,
  whatsapp_number text,
  address text,
  is_open boolean DEFAULT true,
  is_featured boolean DEFAULT false, -- Aparece na home?
  owner_id uuid REFERENCES auth.users(id), -- Quem pode editar (Lojista/B2B)
  created_at timestamp with time zone DEFAULT now()
);

-- 4. TABELA DE ARTIGOS DA HISTÓRIA / PONTOS TURÍSTICOS
CREATE TABLE public.history_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  content text,
  image_url text,
  type text NOT NULL CHECK (type IN ('tourism', 'history', 'culture')),
  tags text[], -- Array de strings
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- =======================================================
-- CONFIGURAÇÃO DE SEGURANÇA (Row Level Security - RLS)
-- =======================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_articles ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas de LEITURA (Todo mundo pode ver no App)
CREATE POLICY "Leitura pública App Settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Leitura pública Categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública Businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Leitura pública History Articles" ON public.history_articles FOR SELECT USING (is_published = true);

-- Políticas de ESCRITA (Apenas Admin autenticado)
-- (O Admin será identificado via auth.uid() e um metadata customizado no Supabase,
--  mas para simplicidade inicial, permitiremos edição por qualquer usuário autenticado.
--  No dashboard do Supabase, você criará o seu usuário Admin).
CREATE POLICY "Admin All Access App Settings" ON public.app_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Categorias" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Businesses" ON public.businesses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access History" ON public.history_articles FOR ALL USING (auth.role() = 'authenticated');

-- CRIE O BUCKET DE STORAGE NO DASHBOARD DO SUPABASE COM O NOME 'salinas-midia' E MARQUE-O COMO PÚBLICO.
