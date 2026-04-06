/* ════════════════════════════════════════════════════════
   MUELLE 21 — main.js
   Funciones:
   1. initNavbar()        → efecto scroll en la barra de nav
   2. initMobileMenu()    → abrir/cerrar menú hamburguesa
   3. initScrollReveal()  → animación de entrada al hacer scroll
   4. initCounter()       → contador animado del número de clientes
════════════════════════════════════════════════════════ */


/* ── 1. NAVBAR ──────────────────────────────────────────
   Agrega la clase .scrolled cuando el usuario baja de 40px.
   El CSS usa esa clase para activar el fondo oscuro/blur.
────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const pasedThreshold = window.scrollY > 40;
    navbar.classList.toggle('scrolled', pasedThreshold);
  });
}


/* ── 2. MENÚ MOBILE ─────────────────────────────────────
   Alterna las clases .open en el hamburger y el menú.
   También bloquea el scroll del body cuando el menú está abierto.
────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');

    // Bloquear scroll del body cuando el menú está abierto
    const isOpen = mobileMenu.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Click en el hamburger
  hamburger.addEventListener('click', toggleMenu);

  // Cerrar al hacer click en cualquier link del menú
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}


/* ── 3. SCROLL REVEAL ───────────────────────────────────
   Observa todos los elementos con clase .reveal.
   Cuando entran en el viewport, agrega .visible (que el CSS
   usa para mostrarlos con una transición suave).
────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Una vez visible, dejamos de observarlo (mejor performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,          // Se activa cuando el 12% del elemento es visible
      rootMargin: '0px 0px -40px 0px'  // Un poco antes del borde inferior
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ── 4. CONTADOR ANIMADO ────────────────────────────────
   Anima un número desde 0 hasta el target.
   Usa easing cúbico para que acelere al inicio y frene al final.
   Se activa una sola vez cuando el elemento entra en pantalla.
────────────────────────────────────────────────────────── */
function animateCounter(element, target, duration = 1600) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: ease-out cúbico (empieza rápido, termina suave)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = '+' + current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = '+' + target;  // Valor final exacto
    }
  }

  requestAnimationFrame(update);
}

function initCounter() {
  const counterEl = document.querySelector('.presencia-number');
  if (!counterEl) return;

  // REEMPLAZAR: cambiar 200 por el número real de clientes
  const TARGET = 20;
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;  // Que no se repita al hacer scroll
        animateCounter(counterEl, TARGET);
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(counterEl);
}


/* ── INIT ───────────────────────────────────────────────
   Punto de entrada: ejecuta todas las funciones cuando
   el DOM está completamente cargado.
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounter();
});