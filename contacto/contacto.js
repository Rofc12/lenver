// =====================================================
// LENVER — Contacto
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------
  // Animaciones al hacer scroll (reveal)
  // ---------------------------------------------------
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ---------------------------------------------------
  // Mapa Leaflet con zona de trabajo animada
  // ---------------------------------------------------
  const mapEl = document.getElementById("map");
  if (mapEl && window.L) {
    const center = [42.561, -8.828];
    const maxRadius = 10000;

    const map = L.map("map", { scrollWheelZoom: false }).setView(center, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker(center).addTo(map).bindPopup("Vilanova de Arousa y alrededores").openPopup();

    const circle = L.circle(center, {
      color: "#00bcd4",
      fillColor: "#00bcd4",
      fillOpacity: 0.35,
      radius: 0,
    }).addTo(map);

    // Anima el círculo solo cuando el mapa entra en pantalla
    let animated = false;
    const mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            let radius = 0;
            (function animateCircle() {
              radius += 250;
              if (radius > maxRadius) radius = maxRadius;
              circle.setRadius(radius);
              if (radius < maxRadius) requestAnimationFrame(animateCircle);
            })();
            mapObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    mapObserver.observe(mapEl);
  }

  // ---------------------------------------------------
  // Botón flotante de WhatsApp
  // ---------------------------------------------------
  const whatsapp = document.querySelector(".whatsapp-float");
  const bubble = document.getElementById("whatsapp-bubble");

  if (whatsapp) {
    requestAnimationFrame(() => whatsapp.classList.add("show"));
  }

  // La burbuja de mensaje aparece a los 25s de estar en la página
  // y se oculta sola a los 7s de haber aparecido.
  if (whatsapp && bubble) {
    const APARECE_A_LOS = 25000;
    const VISIBLE_DURANTE = 7000;

    const mostrarBurbuja = () => {
      bubble.classList.add("show");
      setTimeout(() => bubble.classList.remove("show"), VISIBLE_DURANTE);
    };

    let temporizador = setTimeout(mostrarBurbuja, APARECE_A_LOS);

    // Si el usuario ya hizo clic para escribir, no hace falta mostrarla
    whatsapp.addEventListener(
      "click",
      () => {
        clearTimeout(temporizador);
        bubble.classList.remove("show");
      },
      { once: true }
    );
  }
});
