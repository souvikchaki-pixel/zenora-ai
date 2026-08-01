window.ZENORA_CONFIG = {
  SUPABASE_URL: "https://zqcdtixifoowdfhxdsbnu.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY_HERE",
  GROQ_API_KEY: "YOUR_GROQ_API_KEY_HERE",
  GROQ_MODEL: "llama-3.3-70b-versatile"
};

// Global Supabase Client Initialization
if (typeof supabase !== 'undefined' && window.ZENORA_CONFIG.SUPABASE_URL.indexOf("YOUR_SUPABASE") === -1) {
  window.supabaseClient = supabase.createClient(
    window.ZENORA_CONFIG.SUPABASE_URL,
    window.ZENORA_CONFIG.SUPABASE_ANON_KEY
  );
} else {
  console.warn("Zenora AI: Remember to add your Supabase & Groq keys in js/config.js");
}
