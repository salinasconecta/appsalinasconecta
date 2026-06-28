-- TABELA DE UTILIDADE PÚBLICA
CREATE TABLE IF NOT EXISTS public.utilities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('emergencia', 'farmacia', 'transporte')),
  title text NOT NULL,
  subtitle text,
  info text NOT NULL,
  icon text DEFAULT 'AlertTriangle',
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar leitura pública e permitir inserção (já que estamos sem Auth)
ALTER TABLE public.utilities DISABLE ROW LEVEL SECURITY;
