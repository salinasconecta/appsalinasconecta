-- TABELAS DE PERFIL DO USUÁRIO E GAMIFICAÇÃO
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY,
  full_name text DEFAULT 'Explorador Conecta',
  points integer DEFAULT 0,
  level_name text DEFAULT 'Iniciante',
  address text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  business_id uuid,
  interaction_type text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions DISABLE ROW LEVEL SECURITY;
