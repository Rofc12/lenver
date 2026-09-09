// =====================================================
// LENVER — Proyectos (listado y detalle)
// =====================================================

// Construye una tarjeta de proyecto (imagen + etiqueta + overlay)
function crearTarjetaProyecto(p) {
  const card = document.createElement("a");
  card.className = "card fade-in";
  card.href = `detalle.html?id=${p.id}`;
  card.setAttribute("data-no-history", "");
  card.innerHTML = `
    <img src="${p.imagenes[0]}" alt="${p.titulo}" loading="lazy" decoding="async">
    ${p.categoria ? `<span class="card-tag">${p.categoria}</span>` : ""}
    <div class="card-content">
      <h3>${p.titulo}</h3>
      <span class="card-link">Ver proyecto <i class="fas fa-arrow-right"></i></span>
    </div>
  `;
  return card;
}

// Divide un título en dos mitades, cortando por el espacio más cercano
// a la mitad (para no partir una palabra), imitando el "LEN" / "VER"
// bicolor del logo.
function dividirTituloEnDosColores(texto) {
  const medio = Math.floor(texto.length / 2);
  const espacioSiguiente = texto.indexOf(" ", medio);
  const espacioAnterior = texto.lastIndexOf(" ", medio);

  let corte;
  if (espacioSiguiente === -1 && espacioAnterior === -1) {
    corte = medio; // sin espacios: partir a la mitad tal cual
  } else if (espacioSiguiente === -1) {
    corte = espacioAnterior;
  } else if (espacioAnterior === -1) {
    corte = espacioSiguiente;
  } else {
    corte =
      medio - espacioAnterior <= espacioSiguiente - medio
        ? espacioAnterior
        : espacioSiguiente;
  }

  return [texto.slice(0, corte).trim(), texto.slice(corte).trim()];
}

// =====================
// Listar proyectos
// =====================
function listarProyectos() {
  const lista = document.getElementById("lista-proyectos");
  if (!lista) return;

  proyectos.forEach((p) => {
    lista.appendChild(crearTarjetaProyecto(p));
  });
}

// =====================
// Detalle del proyecto
// =====================
function mostrarDetalle(id) {
  const proyecto = proyectos.find((p) => p.id == id);
  if (!proyecto) return;

  const [mitad1, mitad2] = dividirTituloEnDosColores(proyecto.titulo);
  document.getElementById("titulo").innerHTML =
    `<span class="titulo-mitad-a">${mitad1}</span> <span class="titulo-mitad-b">${mitad2}</span>`;
  document.getElementById("descripcion").textContent = proyecto.descripcion;

  // Slider "antes / después" — solo si el proyecto tiene ambas fotos
  const baSlider = document.getElementById("ba-slider");
  if (proyecto.antes && proyecto.despues) {
    initBeforeAfter(baSlider, proyecto.antes, proyecto.despues);
    baSlider.hidden = false;
  } else {
    baSlider.hidden = true;
  }

  // Carrusel
  const carousel = document.getElementById("carousel-images");
  const dotsContainer = document.getElementById("carousel-dots");
  carousel.innerHTML = "";
  dotsContainer.innerHTML = "";

  proyecto.imagenes.forEach((img, i) => {
    const imgEl = document.createElement("img");
    imgEl.src = img;
    imgEl.alt = `${proyecto.titulo} — imagen ${i + 1}`;
    imgEl.loading = i === 0 ? "eager" : "lazy";
    imgEl.decoding = "async";
    imgEl.className = i === 0 ? "active" : "";
    carousel.appendChild(imgEl);

    const dot = document.createElement("span");
    dot.className = i === 0 ? "dot active" : "dot";
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", `Ver imagen ${i + 1}`);
    dotsContainer.appendChild(dot);
  });

  let currentIndex = 0;
  const imgs = carousel.querySelectorAll("img");
  const dots = dotsContainer.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const carouselEl = document.querySelector(".carousel");

  function showImage(index) {
    imgs.forEach((img, i) => img.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    showImage(currentIndex);
    resetAutoSlide();
    resetControlsVisibility();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imgs.length;
    showImage(currentIndex);
    resetAutoSlide();
    resetControlsVisibility();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentIndex = i;
      showImage(currentIndex);
      resetAutoSlide();
      resetControlsVisibility();
    });
  });

  // Auto slide (solo si hay más de una imagen)
  let autoSlide;
  function startAutoSlide() {
    if (imgs.length <= 1) return;
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % imgs.length;
      showImage(currentIndex);
    }, 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }
  startAutoSlide();

  // Auto-ocultar controles
  let hideTimeout;
  const dotsBar = document.getElementById("carousel-dots");

  function resetControlsVisibility() {
    [dotsBar, prevBtn, nextBtn].forEach((el) => el.classList.remove("hidden"));
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      [dotsBar, prevBtn, nextBtn].forEach((el) => el.classList.add("hidden"));
    }, 3000);
  }

  resetControlsVisibility();
  carouselEl.addEventListener("mousemove", resetControlsVisibility);
  carouselEl.addEventListener("touchstart", resetControlsVisibility, { passive: true });

  // Pausar / reanudar con el ratón o el dedo
  carouselEl.addEventListener("mouseenter", () => clearInterval(autoSlide));
  carouselEl.addEventListener("mouseleave", resetAutoSlide);
  carouselEl.addEventListener("touchstart", () => clearInterval(autoSlide), { passive: true });
  carouselEl.addEventListener("touchend", resetAutoSlide);

  // Deslizar con el dedo (swipe)
  let touchStartX = 0;
  carouselEl.addEventListener(
    "touchstart",
    (e) => (touchStartX = e.changedTouches[0].screenX),
    { passive: true }
  );
  carouselEl.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        currentIndex =
          diff < 0
            ? (currentIndex + 1) % imgs.length
            : (currentIndex - 1 + imgs.length) % imgs.length;
        showImage(currentIndex);
        resetAutoSlide();
      }
    },
    { passive: true }
  );

  // Otros proyectos: 3 al azar (distintos cada vez que entras a la página)
  const otros = document.getElementById("otros-proyectos");
  otros.innerHTML = "";
  const candidatos = proyectos.filter((p) => p.id != id);
  const alAzar = mezclarArray(candidatos).slice(0, 3);
  alAzar.forEach((p) => {
    otros.appendChild(crearTarjetaProyecto(p));
  });
}

// Mezcla un array al azar (Fisher–Yates) sin modificar el original
function mezclarArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// =====================
// Slider "antes / después"
// =====================
function initBeforeAfter(container, antesSrc, despuesSrc) {
  const afterImg = container.querySelector("#ba-after");
  const beforeImg = container.querySelector("#ba-before");
  const beforeWrap = container.querySelector("#ba-before-wrap");
  const handle = container.querySelector("#ba-handle");
  const range = container.querySelector("#ba-range");
  const imgContainer = container.querySelector(".ba-img-container");

  afterImg.src = despuesSrc;
  afterImg.loading = "eager";
  afterImg.decoding = "async";
  beforeImg.src = antesSrc;
  beforeImg.loading = "eager";
  beforeImg.decoding = "async";

  function syncWidth() {
    beforeImg.style.width = `${imgContainer.clientWidth}px`;
  }

  function update(value) {
    beforeWrap.style.width = `${value}%`;
    handle.style.left = `${value}%`;
  }

  range.addEventListener("input", (e) => update(e.target.value));

  // Permite arrastrar directamente sobre la imagen, no solo el control
  let dragging = false;
  const startDrag = () => (dragging = true);
  const stopDrag = () => (dragging = false);
  const moveDrag = (clientX) => {
    if (!dragging) return;
    const rect = imgContainer.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    range.value = percent;
    update(percent);
  };

  imgContainer.addEventListener("mousedown", startDrag);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("mousemove", (e) => moveDrag(e.clientX));

  imgContainer.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchend", stopDrag);
  window.addEventListener(
    "touchmove",
    (e) => moveDrag(e.touches[0].clientX),
    { passive: true }
  );

  window.addEventListener("resize", syncWidth);

  // Espera a que la imagen "después" cargue para medir bien el ancho
  if (afterImg.complete) {
    syncWidth();
  } else {
    afterImg.addEventListener("load", syncWidth, { once: true });
  }
  update(range.value);
}
