// ── Smooth Scroll (Lenis) ──
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ── Scroll Progress Bar ──
  const scrollProgress = document.getElementById('scrollProgress');
  lenis.on('scroll', (e) => {
    if (scrollProgress) {
      const scrollPercent = (e.scroll / e.limit) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }
  });
}

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
    } else {
      entry.target.classList.remove('visible'); // Permite animación bidireccional
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

// ── Contact form ──
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf-wYKiK7y7j_-nOIHJo1Fe41NhLjpUV5sg3KM_ve3LoqIeaC8e-6cKejhLn0Go4w/exec';

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
    // ── Meta Pixel Event ──
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }

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

// ── Testimonial Carousel ──
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let carouselInterval;

if (track && dots.length > 0) {
  const totalSlides = dots.length;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  // Hacer click en los puntos
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
      stopCarousel();
      startCarousel(); // Reiniciar el temporizador
    });
  });

  // Pausar si el mouse está encima
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
  }

  // Iniciar
  startCarousel();
}

// ── Blog Modal Logic ──
const blogModal = document.getElementById('blogModal');
const modalBody = document.getElementById('modalBody');
const closeBlogModal = document.getElementById('closeBlogModal');
const readMoreBtns = document.querySelectorAll('.read-more');

if (blogModal && modalBody && closeBlogModal) {
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.blog-card');
      const content = card.querySelector('.blog-full-content').innerHTML;
      
      modalBody.innerHTML = content;
      blogModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Bloquear scroll básico
      
      // Si Lenis está activo, pausarlo
      if (window.lenis) window.lenis.stop();
    });
  });

  const closeModalFunc = () => {
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  closeBlogModal.addEventListener('click', closeModalFunc);

  // Cerrar al hacer click fuera de la ventana
  blogModal.addEventListener('click', (e) => {
    if (e.target === blogModal) closeModalFunc();
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal.classList.contains('active')) {
      closeModalFunc();
    }
  });
}
