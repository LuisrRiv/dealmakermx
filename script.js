// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

hamburger.addEventListener('click', () => mobileMenu.classList.add('active'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

// ── Scroll animations (IntersectionObserver) ──
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

// ── Contact form ──
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXYB2XlM-2w2wSvm4XOw7UVZtAh9CdY5VmZo8LjBihhFseQyzr8f8Iw4QunLH9KK0/exec';

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form = this;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  
  // Mostrar estado de carga
  btn.innerHTML = 'Enviando...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  const formData = new FormData(form);

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    btn.innerHTML = '✓ ¡Mensaje enviado con éxito!';
    btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    btn.classList.remove('btn-pulse');
    btn.style.opacity = '1';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.classList.add('btn-pulse');
      btn.disabled = false;
      form.reset();
    }, 4000);
  })
  .catch(error => {
    console.error('Error al enviar:', error);
    btn.innerHTML = '❌ Hubo un error. Intenta de nuevo.';
    btn.style.background = '#EF4444';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Counter animation for stats ──
function animateCounters() {
  document.querySelectorAll('.hero-stats .stat h3').forEach(counter => {
    const text = counter.textContent;
    const num = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
      counter.textContent = current + suffix;
    }, 30);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
heroObserver.observe(document.querySelector('.hero-stats'));

// ── AI Chat Logic ──
const mascotToggle = document.getElementById('mascotToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const aiChatForm = document.getElementById('aiChatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// TODO: Reemplazar con la URL del nuevo Webhook del Chatbot en Google Apps Script
const AI_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzs-nJmMnKSNW11aFLVOScZ0yV0EMstAg9S276MEygajafjG46Bwmu1D3ghMkpQcpE/exec';

mascotToggle.addEventListener('click', () => {
  chatWindow.classList.add('active');
  mascotToggle.style.display = 'none';
  chatInput.focus();
});

closeChat.addEventListener('click', () => {
  chatWindow.classList.remove('active');
  mascotToggle.style.display = 'block';
});

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message fade-up`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById('typingIndicator');
  if (typingDiv) typingDiv.remove();
}

aiChatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Mostrar mensaje del usuario
  appendMessage(userText, 'user');
  chatInput.value = '';
  
  // Mostrar indicador de que el bot está escribiendo
  appendTypingIndicator();

  try {
    const formData = new FormData();
    formData.append('message', userText);

    const response = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    removeTypingIndicator();
    appendMessage(result, 'bot');
  } catch (error) {
    console.error('Error in AI Chat:', error);
    removeTypingIndicator();
    appendMessage('Lo siento, tuve un problema de conexión. ¿Puedes intentar de nuevo?', 'bot');
  }
});
