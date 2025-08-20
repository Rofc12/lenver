// Animar secciones al hacer scroll
const secciones = document.querySelectorAll(".section");

const aparecerSeccion = () => {
  const triggerBottom = window.innerHeight * 0.8;

  secciones.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      sec.classList.add("show");
    }
  });
};

window.addEventListener("scroll", aparecerSeccion);
aparecerSeccion();

// Menú hamburguesa con overlay y bloqueo scroll
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const overlay = document.querySelector(".overlay");
const body = document.body;

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
  overlay.classList.toggle("active");
  body.classList.toggle("no-scroll"); // bloquea o desbloquea scroll
});

// Cerrar menú al hacer click en un link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("no-scroll");
  });
});

// Cerrar menú al hacer click en overlay
overlay.addEventListener("click", () => {
  navLinks.classList.remove("active");
  hamburger.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("no-scroll");
});

let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    // Scroll hacia abajo → ocultar header
    header.classList.add("hide");
  } else {
    // Scroll hacia arriba → mostrar header
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

// IntersectionObserver para animar elementos internos
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

// Observa texto y gif en "Quiénes Somos"
document.querySelectorAll(".text-quienes, .gif-box").forEach(el => observer.observe(el));


  // Animación scroll "Servicios"
  const serviceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".service-card").forEach(card => {
    serviceObserver.observe(card);

    // En móvil se expande al tocar
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });
  

  // Animación scroll "Proyectos"
const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".project-card").forEach(card => {
  projectObserver.observe(card);
});


