class Chatbot {
    constructor() {
      this.chatbot = document.getElementById('chatbot');
      this.chatbotWindow = document.getElementById('chatbotWindow');
      this.chatbotClose = document.getElementById('chatbotClose');
      this.chatbotMessages = document.getElementById('chatbotMessages');
      this.chatbotForm = document.getElementById('chatbotForm');
      this.chatbotInput = document.getElementById('chatbotInput');
      this.loadingMessageElem = null;
  
      this.addEventListeners();
    }
  
    addEventListeners() {
      this.chatbot.addEventListener('click', () => {
        this.chatbotWindow.classList.toggle('hidden');
        this.chatbotInput.focus();
      });
  
      this.chatbotClose.addEventListener('click', () => {
        this.chatbotWindow.classList.add('hidden');
      });
  
      this.chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = this.chatbotInput.value.trim();
        if (userInput) {
          this.addMessage(userInput, 'user');
          this.chatbotInput.value = '';
          this.addMessage('Typing...', 'bot', true);
          try {
            const response = await this.getAIResponse(userInput);
            this.updateLastBotMessage(response);
          } catch (error) {
            this.updateLastBotMessage("Sorry, something went wrong.");
          }
        }
      });
    }
  
    addMessage(message, sender, isLoading = false) {
      const messageElem = document.createElement('div');
      messageElem.className = sender === 'user' ? 'text-right' : 'text-left';
      messageElem.innerHTML = `<p class="inline-block px-4 py-2 rounded-lg ${sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'} max-w-xs">${message}</p>`;
      if (isLoading) {
        this.loadingMessageElem = messageElem;
      }
      this.chatbotMessages.appendChild(messageElem);
      this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }
  
    updateLastBotMessage(message) {
      if (this.loadingMessageElem) {
        this.loadingMessageElem.innerHTML = `<p class="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800 max-w-xs">${message}</p>`;
        this.loadingMessageElem = null;
      }
    }
  
    async getAIResponse(userInput) {
      const apiKey = 'AIzaSyCYpkOqENyAZAZQJdVIuArAKLnUQQ2HtE8'; // Replace with your Gemini API key
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userInput }] }]
        })
      });
  
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API.';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new Chatbot());
  