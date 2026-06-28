import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

// Inicializa o cliente do Supabase para uso no Frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
