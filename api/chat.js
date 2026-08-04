// api/chat.js
export default async function handler(req, res) {
  // 1. Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read 'prompt' (matching your main.js body payload)
    const { prompt, message } = req.body;
    const userMessage = prompt || message;

    if (!userMessage) {
      return res.status(400).json({ error: 'No prompt provided.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not set in Vercel environment variables.' });
    }

    // Call Groq API (Free tier: 14,400 requests/day)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Zenora AI, a smart and helpful AI assistant.' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({ error: data.error?.message || 'Groq API error' });
    }

    // Returns standard OpenAI structure so data.choices[0].message.content works!
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
