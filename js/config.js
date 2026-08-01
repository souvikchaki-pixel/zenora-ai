// js/config.js

window.ZENORA_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: "https://zqcdtixifoowdfhxdsbnu.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxY2R0aXhpZm93ZGZoeGRzYm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODY5ODgsImV4cCI6MjEwMDk2Mjk4OH0.fExZ3X0BXqRC-scHcTG6B1sqUVAZZQP3IrIeHaMdkyI",
  
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
