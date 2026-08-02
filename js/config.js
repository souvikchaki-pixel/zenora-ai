// js/config.js

window.ZENORA_CONFIG = {
  SUPABASE_URL: "https://zqcdtixifowdfhxdsbnu.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxY2R0aXhpZm93ZGZoeGRzYm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODY5ODgsImV4cCI6MjEwMDk2Mjk4OH0.fExZ3X0BXqRC-scHcTG6B1sqUVAZZQP3IrIeHaMdkyI"
};

if (typeof supabase !== 'undefined' && window.ZENORA_CONFIG.SUPABASE_URL) {
  window.supabaseClient = supabase.createClient(
    window.ZENORA_CONFIG.SUPABASE_URL,
    window.ZENORA_CONFIG.SUPABASE_ANON_KEY
  );
}
