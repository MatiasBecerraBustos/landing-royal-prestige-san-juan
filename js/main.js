/* ============================================================
   Scripts principales - Royal Prestige Mercedario
   -------------------------------------------------------------------
   Este archivo agrupa la lógica de interacción de la página:
   1) Menú hamburguesa del header (mobile)
   2) Año dinámico en el footer
   3) Animaciones de aparición al hacer scroll (reveal)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------
     1. MENÚ HAMBURGUESA (MOBILE)
     ------------------------------------------------------------
     En pantallas <= 768px el menú se esconde detrás de un botón
     hamburguesa. Este código alterna las clases "--activo" que el
     CSS usa para desplegar/ocultar el panel, y mantiene la
     accesibilidad (ARIA) actualizada:
       - aria-expanded: indica si el panel está abierto o cerrado.
       - aria-label: cambia entre "Abrir menú" y "Cerrar menú".
     Además cierra el panel con la tecla Escape, al hacer click
     fuera de él, y al volver a pantalla de escritorio.
  */
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');
  const links = document.querySelectorAll('.header__link');

  if (hamburger && nav) {

    function closeMenu() {
      hamburger.classList.remove('header__hamburger--activo');
      nav.classList.remove('header__nav--activo');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
    }

    function openMenu() {
      hamburger.classList.add('header__hamburger--activo');
      nav.classList.add('header__nav--activo');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Cerrar menú');
    }

    function toggleMenu() {
      const isOpen = nav.classList.contains('header__nav--activo');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Cerrar el panel al hacer click en cualquiera de sus enlaces.
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con la tecla Escape (accesibilidad de teclado).
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    // Cerrar si se hace click fuera del botón y del panel.
    document.addEventListener('click', function (event) {
      if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
        closeMenu();
      }
    });

    // Si la ventana crece a escritorio (>= 993px), reseteamos el menú
    // para que no quede abierto al volver a un tamaño móvil/tablet.
    const mediaDesktop = window.matchMedia('(min-width: 993px)');
    if (mediaDesktop.addEventListener) {
      mediaDesktop.addEventListener('change', function (e) {
        if (e.matches) closeMenu();
      });
    } else {
      // Fallback para navegadores antiguos.
      mediaDesktop.addListener(function (e) {
        if (e.matches) closeMenu();
      });
    }
  }

  /* ------------------------------------------------------------
     2. AÑO DINÁMICO DEL FOOTER
     ------------------------------------------------------------
     Sustituye el año "estático" por el año actual, evitando tener
     que actualizarlo manualmente cada año.
  */
  const anio = document.getElementById('footer-anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     3. ANIMACIONES DE APARICIÓN AL HACER SCROLL (REVEAL)
     ------------------------------------------------------------
     Usamos IntersectionObserver, una API nativa del navegador que
     detecta cuándo un elemento entra en el área visible (viewport).

     - Elementos con la clase ".reveal" inician ocultos (opacity:0,
       traslación vertical) y, al entrar en pantalla, reciben la clase
       ".reveal--activo" que activa la transición CSS hacia visible.
     - "rootMargin: '0px 0px -60px 0px'" hace que el disparo ocurra
       un poco antes de llegar al borde inferior (mejor sensación).
     - "threshold: 0.1" activa cuando al menos 10% del elemento está
       visible.
     - Al final desconectamos el observer: una vez animado, ya no es
       necesario seguir observándolo (ahorra recursos).
  */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--activo');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: si el navegador no soporta IntersectionObserver,
    // mostramos todo directamente (sin animación) por seguridad.
    revealElements.forEach(function (el) {
      el.classList.add('reveal--activo');
    });
  }

});
