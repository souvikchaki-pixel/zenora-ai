async function checkAuthSession(redirectOnFail = true) {
  if (!window.supabaseClient) return null;
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (!session && redirectOnFail) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

// Updated callGroqAI function that routes through Vercel's secure backend
async function callGroqAI(promptText) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: promptText
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
