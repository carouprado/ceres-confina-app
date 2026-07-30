// Configuracao publica do Supabase.
// A chave publishable pode ficar no frontend. Nunca use a chave service_role aqui.
const SUPABASE_URL = "https://etfuzczovnkfclzelsto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nsG9aoKSlbTeV4TuJxC7IA_EmTMrFUB";

window.ceresSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
