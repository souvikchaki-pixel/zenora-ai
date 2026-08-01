// js/config.js

window.ZENORA_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: "https://zqcdtixifoowdfhxdsbnu.supabase.co",
  SUPABASE_ANON_KEY: "PASTE_YOUR_SUPABASE_ANON_KEY_HERE",
  
  // Groq Model Setting (Key is securely handled via Vercel Environment Variables)
  GROQ_MODEL: "llama-3.3-70b-versatile"
};

// Global Supabase Client Initialization
if (typeof supabase !== 'undefined' && window.ZENORA_CONFIG.SUPABASE_URL) {
  window.supabaseClient = supabase.createClient(
    window.ZENORA_CONFIG.SUPABASE_URL,
    window.ZENORA_CONFIG.SUPABASE_ANON_KEY
  );
}
