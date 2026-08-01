async function checkAuthSession(redirectOnFail = true) {
  if (!window.supabaseClient) return null;
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (!session && redirectOnFail) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

async function callGroqAI(promptText) {
  const apiKey = window.ZENORA_CONFIG.GROQ_API_KEY;
  const model = window.ZENORA_CONFIG.GROQ_MODEL;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error('Groq AI Request Failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

function handleLogout() {
  if (window.supabaseClient) {
    window.supabaseClient.auth.signOut().then(() => {
      localStorage.removeItem('zenora_user');
      localStorage.removeItem('zenora_user_session');
      window.location.href = 'index.html';
    });
  } else {
    localStorage.removeItem('zenora_user');
    localStorage.removeItem('zenora_user_session');
    window.location.href = 'index.html';
  }
}
