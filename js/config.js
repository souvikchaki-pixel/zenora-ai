// js/config.js

window.ZENORA_CONFIG = {
  // Paste your Supabase Anon key inside the quotes below
  SUPABASE_URL: "https://zqcdtixifoowdfhxdsbnu.supabase.co",
  SUPABASE_ANON_KEY: "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"
};

// Global Supabase Client Initialization
if (typeof supabase !== 'undefined' && window.ZENORA_CONFIG.SUPABASE_URL) {
  window.supabaseClient = supabase.createClient(
    window.ZENORA_CONFIG.SUPABASE_URL,
    window.ZENORA_CONFIG.SUPABASE_ANON_KEY
  );
}
