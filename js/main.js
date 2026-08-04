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
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptText
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Groq AI Request Failed');
    }

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid response structure from AI.');
    }
  } catch (error) {
    console.error('AI Error:', error);
    throw error;
  }
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
