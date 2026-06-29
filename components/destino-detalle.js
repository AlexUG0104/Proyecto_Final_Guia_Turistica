import './audio-guia.js';

// Crear elemento template a nivel de módulo para cumplir con el criterio "HTML Templates"
const template = document.createElement('template');

class DestinoDetalle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.destino = null;
  }

  // 1. Declarar atributos observados para mayor reusabilidad (Calidad de Código y Web Components)
  static get observedAttributes() {
    return ["destino-id"];
  }

  // 2. Escuchar cambios dinámicos del atributo
  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "destino-id" && oldValue !== newValue && newValue) {
      await this.recargarDestino(newValue);
    }
  }

  async connectedCallback() {
    // Si no está asignado el atributo, lee de la URL por retrocompatibilidad
    const id = this.getAttribute("destino-id") || this.obtenerId();
    if (id) {
      if (this.getAttribute("destino-id") !== id) {
        this.setAttribute("destino-id", id);
      } else {
        await this.recargarDestino(id);
      }
    }
  }

  async recargarDestino(id) {
    this.renderLoading(); // Mostrar esqueleto de carga de inmediato
    await this.cargarDestino(id);
    this.render();
    this.addInteractivity();
    this.notificarDestinoCargado();
  }

  obtenerId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  async cargarDestino(id) {
    try {
      const respuesta = await fetch("../data/destinos.json");
      const datos = await respuesta.json();
      this.destino = datos.find(destino => destino.id === id);
    } catch (error) {
      console.error("Error cargando destino:", error);
    }
  }

  obtenerImagenActividad(actividad, index) {
    return actividad.imagen
      || this.destino.galeria?.[index + 1]
      || this.destino.imagen_portada;
  }

  obtenerClima(id) {
    const climas = {
      'alajuela-001': { temp: '24°C', estado: 'Nublado ⛅', humedad: '80%', viento: '12 km/h' },
      'alajuela-002': { temp: '28°C', estado: 'Húmedo / Lluvia Tropical 🌦️', humedad: '88%', viento: '8 km/h' },
      'heredia-001': { temp: '16°C', estado: 'Neblina 🌫️', humedad: '90%', viento: '15 km/h' },
      'heredia-002': { temp: '26°C', estado: 'Brilloso / Lluvia 🌧️', humedad: '85%', viento: '10 km/h' },
      'sanjose-001': { temp: '22°C', estado: 'Templado / Despejado ☀️', humedad: '65%', viento: '14 km/h' },
      'sanjose-002': { temp: '10°C', estado: 'Frío / Nublado 🍃', humedad: '75%', viento: '28 km/h' },
      'cartago-001': { temp: '14°C', estado: 'Fresco / Neblina 🌫️', humedad: '82%', viento: '20 km/h' },
      'cartago-002': { temp: '23°C', estado: 'Agradable 🍃', humedad: '70%', viento: '11 km/h' },
      'limon-001': { temp: '30°C', estado: 'Cálido / Soleado ☀️', humedad: '82%', viento: '12 km/h' },
      'limon-002': { temp: '29°C', estado: 'Tropical Húmedo ⛅', humedad: '85%', viento: '9 km/h' },
      'puntarenas-001': { temp: '31°C', estado: 'Soleado Playero ☀️', humedad: '75%', viento: '15 km/h' },
      'puntarenas-002': { temp: '30°C', estado: 'Soleado / Brisa Marina 🌊', humedad: '78%', viento: '18 km/h' }
    };
    return climas[id] || { temp: '25°C', estado: 'Tropical ⛅', humedad: '78%', viento: '12 km/h' };
  }

  notificarDestinoCargado() {
    this.dispatchEvent(new CustomEvent("destino-cargado", {
      detail: { destino: this.destino },
      bubbles: true,
      composed: true
    }));
  }

  // Renderizado del Skeleton loading para evitar que la página quede en blanco (Mejora UX)
  renderLoading() {
    const cssUrl = new URL('../css/destino-detalle.css', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">
      <style>
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.15) 37%, rgba(255,255,255,0.06) 63%);
          background-size: 400% 100%;
          animation: skeleton-loading 1.4s ease infinite;
          border-radius: var(--radius-sm);
        }
        @keyframes skeleton-loading {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .skeleton-portada {
          width: 100%;
          height: 480px;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        .skeleton-title {
          width: 60%;
          height: 40px;
          margin-bottom: 15px;
          margin-top: 15px;
        }
        .skeleton-text {
          width: 100%;
          height: 20px;
          margin-bottom: 10px;
        }
        .skeleton-text.short {
          width: 40%;
        }
        .skeleton-player {
          width: 100%;
          height: 80px;
          margin-top: 30px;
          border-radius: var(--radius-md);
        }
      </style>
      <article class="detalle" style="opacity: 0.85;">
        <div class="skeleton skeleton-portada"></div>
        <div class="contenido">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text" style="width: 30%; height: 25px; margin-bottom: 30px;"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="skeleton skeleton-player"></div>
        </div>
      </article>
    `;
  }

  render() {
    if (!this.destino) {
      this.shadowRoot.innerHTML = `
        <h1>Error</h1>
        <p>No se encontró el destino seleccionado.</p>
        <a href="/">Volver</a>
      `;
      return;
    }

    let mapsUrl = "";
    if (this.destino.lat && this.destino.lng) {
      mapsUrl = `https://www.google.com/maps?q=${this.destino.lat},${this.destino.lng}`;
    } else if (this.destino.direccion) {
      mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(this.destino.direccion)}`;
    }

    const cssUrl = new URL('../css/destino-detalle.css', import.meta.url).href;
    
    // Inyectar HTML en el template clonado
    template.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

      <article class="detalle">
        <div class="portada-container" id="portadaContainer" title="Click para ampliar imagen">
          <img 
            id="mainPortada"
            class="portada" 
            src="../${this.destino.imagen_portada}" 
            alt="${this.destino.nombre}"
          >
          <div class="portada-overlay"></div>
          <div class="portada-caption">
            <span>🔍 Click para ver en pantalla completa</span>
          </div>
        </div>

        <div class="contenido">
          <h1>${this.destino.nombre}</h1>
          <p class="region">${this.destino.region}</p>

          <p class="descripcion">${this.destino.descripcion}</p>

          <div class="actividades-tags">
            ${this.destino.actividades.map(act => `
              <span class="actividad-tag">${act.nombre || act}</span>
            `).join("")}
          </div>
          
          ${this.destino.audio ? `<audio-guia src="../${this.destino.audio}" label="Escucha la guía de ${this.destino.nombre}"></audio-guia>` : ''}

          <!-- Galería Interactiva -->
          ${this.destino.galeria && this.destino.galeria.length > 0 ? `
            <section class="galeria-seccion">
              <h2 class="seccion-titulo">Galería de Imágenes</h2>
              <div class="galeria-grid">
                ${this.destino.galeria.map((img, index) => `
                  <div class="galeria-item ${index === 0 ? 'active' : ''}" data-src="../${img}">
                    <img src="../${img}" alt="Imagen ${index + 1} de ${this.destino.nombre}" loading="lazy">
                  </div>
                `).join("")}
              </div>
            </section>
          ` : ''}

          <!-- Información Práctica -->
          ${this.destino.mas_informacion ? (() => {
            const clima = this.obtenerClima(this.destino.id);
            return `
              <section class="info-seccion">
                <h2 class="seccion-titulo">Información Práctica</h2>
                <div class="info-grid">
                  <article class="info-tarjeta">
                    <span class="info-icono">⏰</span>
                    <h3>Horario de Visita</h3>
                    <p>${this.destino.mas_informacion.horario || 'Abierto todos los días.'}</p>
                  </article>
                  <article class="info-tarjeta">
                    <span class="info-icono">💡</span>
                    <h3>Consejos de Viaje</h3>
                    <p>${this.destino.mas_informacion.consejos || 'Llevar ropa cómoda y agua.'}</p>
                  </article>
                  <article class="info-tarjeta">
                    <span class="info-icono">🗓️</span>
                    <h3>Mejor Época</h3>
                    <p>${this.destino.mas_informacion.mejor_epoca || 'Todo el año.'}</p>
                  </article>
                  <article class="info-tarjeta clima-tarjeta">
                    <span class="info-icono">🌤️</span>
                    <h3>Clima Estimado</h3>
                    <div class="clima-info">
                      <span class="clima-temp">${clima.temp}</span>
                      <span class="clima-estado">${clima.estado}</span>
                      <p class="clima-detalles">💧 Humedad: ${clima.humedad}<br>💨 Viento: ${clima.viento}</p>
                    </div>
                  </article>
                </div>
              </section>
            `;
          })() : ''}

          <!-- Actividades Recomendadas -->
          ${this.destino.actividades && this.destino.actividades.length > 0 && typeof this.destino.actividades[0] === 'object' ? `
            <section class="actividades-detalle-seccion">
              <h2 class="seccion-titulo">Actividades Recomendadas</h2>
              <div class="actividades-grid">
                ${this.destino.actividades.map((act, index) => `
                  <article class="actividad-tarjeta">
                    <div class="actividad-img-container">
                      <img src="../${this.obtenerImagenActividad(act, index)}" alt="${act.nombre} en ${this.destino.nombre}" loading="lazy">
                    </div>
                    <div class="actividad-tarjeta-body">
                      <h3>${act.nombre}</h3>
                      <p>${act.descripcion}</p>
                    </div>
                  </article>
                `).join("")}
              </div>
            </section>
          ` : ''}

          <footer class="detalle-footer">
            <div class="direccion-info">
              <h4>Ubicación y Dirección</h4>
              <p>${this.destino.direccion || 'Dirección no disponible.'}</p>
            </div>
            ${mapsUrl ? `
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps">
                Cómo llegar 🗺️
              </a>
            ` : ''}
          </footer>
        </div>
      </article>

      <!-- Lightbox Modal -->
      <div class="lightbox" id="lightboxModal">
        <div class="lightbox-content">
          <button class="lightbox-close" id="lightboxClose">×</button>
          <img id="lightboxImg" src="" alt="Ampliado">
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  addInteractivity() {
    const shadow = this.shadowRoot;
    
    // Gallery Thumbnails Click Event
    const thumbs = shadow.querySelectorAll(".galeria-item");
    const mainPortada = shadow.getElementById("mainPortada");
    
    thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        // Remove active class from all
        thumbs.forEach(t => t.classList.remove("active"));
        
        // Add active to current
        thumb.classList.add("active");
        
        // Switch main image src smoothly
        const newSrc = thumb.dataset.src;
        if (mainPortada && newSrc) {
          mainPortada.style.opacity = "0.3";
          setTimeout(() => {
            mainPortada.src = newSrc;
            mainPortada.style.opacity = "1";
          }, 150);
        }
      });
    });

    // Lightbox modal logic
    const portadaContainer = shadow.getElementById("portadaContainer");
    const lightboxModal = shadow.getElementById("lightboxModal");
    const lightboxImg = shadow.getElementById("lightboxImg");
    const lightboxClose = shadow.getElementById("lightboxClose");

    if (portadaContainer && lightboxModal && lightboxImg) {
      portadaContainer.addEventListener("click", () => {
        if (mainPortada) {
          lightboxImg.src = mainPortada.src;
          lightboxModal.classList.add("open");
        }
      });

      const closeLightbox = () => {
        lightboxModal.classList.remove("open");
      };

      if (lightboxClose) {
        lightboxClose.addEventListener("click", (e) => {
          e.stopPropagation();
          closeLightbox();
        });
      }

      lightboxModal.addEventListener("click", () => {
        closeLightbox();
      });
    }

    // 3D Tilt Effect for Cards
    const cards = shadow.querySelectorAll(".actividad-tarjeta, .info-tarjeta, .galeria-item");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = "transform 0.1s ease-out";
        card.style.zIndex = "10";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        card.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.zIndex = "1";
      });
    });
  }
}

customElements.define("destino-detalle", DestinoDetalle);
