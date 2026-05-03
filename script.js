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
