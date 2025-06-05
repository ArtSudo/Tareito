document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const userId = 1;
  
    function appendMessage(text, sender) {
      const div = document.createElement('div');
      div.classList.add('message', sender);
      div.textContent = `${sender === 'user' ? 'Tú' : 'Bot'}: ${text}`;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }
  
    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;
  
      appendMessage(message, 'user');
      input.value = '';
  
      try {
        const res = await fetch(`http://localhost:8080/bot/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        appendMessage(data.response || 'Sin respuesta', 'bot');
      } catch (err) {
        appendMessage('Error al contactar con el bot.', 'bot');
      }
    }
  
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
  });
  