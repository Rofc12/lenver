// =====================================================
// LENVER — Script de la página de inicio
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // Observador genérico para animaciones al hacer scroll.
  // Se repite tanto al bajar como al volver a subir.
  //
  // Mostrar y ocultar usan umbrales distintos a propósito:
  // - Se MUESTRA en cuanto el elemento es 20% visible (como antes).
  // - Se OCULTA solo cuando queda 0% visible, es decir, completamente
  //   fuera de pantalla. Antes ambas cosas compartían el mismo punto de
  //   disparo, y como ese punto coincide justo con el borde de la
  //   pantalla, el propio movimiento de la animación podía cruzarlo
  //   varias veces seguidas — eso causaba el rebote/parpadeo raro.
  //   Al exigir 0% visible para ocultar, el "salto" siempre pasa cuando
  //   ya no se puede ver, así que no se nota.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.intersectionRatio >= 0.2) {
          el.classList.add("show");
        } else if (entry.intersectionRatio === 0) {
          el.classList.remove("show");
        }
        // Ratios intermedios (entre 0 y 0.2): se deja el estado como está.
      });
    },
    { threshold: [0, 0.2] }
  );

  document
    .querySelectorAll(".text-quienes, .gif-box, .service-card, .project-card, .presupuesto-content, .servicios")
    .forEach((el) => observer.observe(el));

  // Tarjetas de servicios: expandir al tocar en móvil
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("active"));
  });

    // ---------------------------------------------------
  // Parallax en móvil para el fondo del logo (.servicios)
  // ---------------------------------------------------
  // background-attachment: fixed no es fiable en iPhone (todos los
  // navegadores ahí usan WebKit) y puede dejar la imagen en blanco. Se
  // desactiva en pantallas pequeñas (ver styles.css) y aquí se simula el
  // mismo efecto de profundidad moviendo el fondo con background-position
  // según el scroll, que sí es compatible con iOS.
  const heroBg = document.querySelector(".servicios");
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  if (heroBg) {
    let ticking = false;

    const updateParallax = () => {
      if (mobileQuery.matches) {
        const rect = heroBg.getBoundingClientRect();
        const offset = rect.top * 0.3; // velocidad del efecto
        heroBg.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      } else {
        heroBg.style.backgroundPosition = ""; // deja el CSS de escritorio intacto
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  }
  
});
