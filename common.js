// =====================================================
// LENVER — Script común (header, nav, footer)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------
  // Navegación sin historial (enlaces con data-no-history)
  // ---------------------------------------------------
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-no-history]");
    if (link) {
      e.preventDefault();
      window.location.replace(link.getAttribute("href"));
    }
  });

  // ---------------------------------------------------
  // Menú hamburguesa + overlay + bloqueo de scroll
  // ---------------------------------------------------
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".overlay");
  const body = document.body;

  const closeMenu = () => {
    navLinks?.classList.remove("active");
    hamburger?.classList.remove("active");
    overlay?.classList.remove("active");
    body.classList.remove("no-scroll");
    hamburger?.setAttribute("aria-expanded", "false");
  };

  if (hamburger && navLinks && overlay) {
    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-label", "Abrir menú de navegación");
    hamburger.setAttribute("aria-expanded", "false");

    const toggleMenu = () => {
      const isActive = navLinks.classList.toggle("active");
      hamburger.classList.toggle("active", isActive);
      overlay.classList.toggle("active", isActive);
      body.classList.toggle("no-scroll", isActive);
      hamburger.setAttribute("aria-expanded", String(isActive));
    };

    hamburger.addEventListener("click", toggleMenu);
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    overlay.addEventListener("click", closeMenu);
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ---------------------------------------------------
  // Ocultar/mostrar header al hacer scroll (optimizado)
  // ---------------------------------------------------
  const header = document.querySelector("header");
  if (header) {
    let lastScroll = window.pageYOffset;
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 120) {
              header.classList.add("hide");
            } else {
              header.classList.remove("hide");
            }
            lastScroll = currentScroll;
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ---------------------------------------------------
  // Año dinámico en el footer
  // ---------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
