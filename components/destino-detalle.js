import './audio-guia.js';

class DestinoDetalle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.destino = null;
  }

  async connectedCallback() {
    const id = this.obtenerId();
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
    const respuesta = await fetch("../data/destinos.json");
    const datos = await respuesta.json();

    this.destino = datos.find(destino => destino.id === id);
  }

  notificarDestinoCargado() {
    this.dispatchEvent(new CustomEvent("destino-cargado", {
      detail: { destino: this.destino },
      bubbles: true,
      composed: true
    }));
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
    
    this.shadowRoot.innerHTML = `
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
                    <img src="../${img}" alt="Galería ${this.destino.nombre} ${index + 1}">
                  </div>
                `).join("")}
              </div>
            </section>
          ` : ''}

          <!-- Información Práctica -->
          ${this.destino.mas_informacion ? `
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
              </div>
            </section>
          ` : ''}

          <!-- Actividades Recomendadas -->
          ${this.destino.actividades && this.destino.actividades.length > 0 && typeof this.destino.actividades[0] === 'object' ? `
            <section class="actividades-detalle-seccion">
              <h2 class="seccion-titulo">Actividades Recomendadas</h2>
              <div class="actividades-grid">
                ${this.destino.actividades.map(act => `
                  <article class="actividad-tarjeta">
                    <div class="actividad-img-container">
                      <img src="../${act.imagen}" alt="${act.nombre}">
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
  }
}

customElements.define("destino-detalle", DestinoDetalle);
