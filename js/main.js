// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent page reload

      const userText = chatInput.value.trim();
      if (!userText) return;

      // 1. Display User Message
      appendMessage(userText, 'user');
      chatInput.value = '';

      // 2. Display Loading Indicator
      const loadingMessage = appendMessage('Zenora AI is thinking...', 'ai-loading');

      try {
        // 3. Call AI Backend
        const aiReply = await callGroqAI(userText);
        
        // Remove loading message & show actual response
        if (loadingMessage) loadingMessage.remove();
        appendMessage(aiReply, 'ai');

      } catch (err) {
        if (loadingMessage) loadingMessage.remove();
        appendMessage('Error: ' + err.message, 'error');
      }
    });
  }
});

// Helper function to append messages into the chat UI
function appendMessage(text, sender) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return null;

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom

  return msgDiv;
}
