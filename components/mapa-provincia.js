// Crear elemento template a nivel de módulo para cumplir con el criterio "HTML Templates"
const template = document.createElement('template');

class MapaProvincia extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.region = null;
    this.destinos = [];
  }

  // 1. Declarar atributos observados para mayor reusabilidad
  static get observedAttributes() {
    return ["region"];
  }

  // 2. Escuchar cambios dinámicos del atributo
  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "region" && oldValue !== newValue && newValue) {
      await this.recargarProvincia(newValue);
    }
  }

  async connectedCallback() {
    // Si no está asignado el atributo, lee de la URL por retrocompatibilidad
    const region = this.getAttribute("region") || this.obtenerRegionDeURL();
    if (region) {
      if (this.getAttribute("region") !== region) {
        this.setAttribute("region", region);
      } else {
        await this.recargarProvincia(region);
      }
    }
  }

  async recargarProvincia(region) {
    this.region = region;
    this.renderLoading(); // Mostrar esqueleto de carga de inmediato
    await this.cargarDestinos();
    this.render();
    this.addEvents();
  }

  obtenerRegionDeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("region");
  }

  obtenerImagenProvincia() {
    const imagenes = {
      "Guanacaste": "../assents/img/guanacaste/Mapa_de_Guanacaste_cantones.jpg",
      "Alajuela": "../assents/img/alajuela/Alajuelacantones.png",
      "Heredia": "../assents/img/heredia/heredia-cantones.gif",
      "San José": "../assents/img/san-jose/SanJoseCantones.png",
      "Cartago": "../assents/img/cartago/cartagocantones.png",
      "Limón": "../assents/img/limon/limoncantones.gif",
      "Puntarenas": "../assents/img/puntarenas/Puntarenascantones.png"
    };

    return imagenes[this.region];
  }

  async cargarDestinos() {
    try {
      const respuesta = await fetch("../data/destinos.json");
      const datos = await respuesta.json();
      this.destinos = datos.filter(destino => destino.region === this.region);
    } catch (error) {
      console.error("Error cargando destinos de provincia:", error);
    }
  }

  // Renderizado del Skeleton loading para evitar que la página quede en blanco (Mejora UX)
  renderLoading() {
    const cssUrl = new URL('../css/mapa-provincia.css', import.meta.url).href;
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
        .skeleton-map {
          width: 100%;
          height: 400px;
          border-radius: var(--radius-md);
        }
        .skeleton-list-item {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        .skeleton-thumb {
          width: 120px;
          height: 80px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }
        .skeleton-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
        }
      </style>
      <section class="contenedor" style="opacity: 0.85;">
        <div class="skeleton" style="width: 250px; height: 45px; margin: 0 auto 10px auto;"></div>
        <div class="skeleton" style="width: 320px; height: 20px; margin: 0 auto 30px auto;"></div>
        
        <div class="card">
          <div class="skeleton skeleton-map"></div>
        </div>

        <div class="lista" style="margin-top: 30px;">
          <div class="skeleton-list-item">
            <div class="skeleton skeleton-thumb"></div>
            <div class="skeleton-details">
              <div class="skeleton" style="width: 50%; height: 20px;"></div>
              <div class="skeleton" style="width: 30%; height: 15px;"></div>
            </div>
          </div>
          <div class="skeleton-list-item">
            <div class="skeleton skeleton-thumb"></div>
            <div class="skeleton-details">
              <div class="skeleton" style="width: 60%; height: 20px;"></div>
              <div class="skeleton" style="width: 25%; height: 15px;"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  render() {
    const imagen = this.obtenerImagenProvincia();
    const homeUrl = new URL('../index.html', import.meta.url).href;

    if (!this.region || !imagen) {
      this.shadowRoot.innerHTML = `
        <h1>Error</h1>
        <p>No se encontró la provincia seleccionada.</p>
        <a href="${homeUrl}">Volver</a>
      `;
      return;
    }

    const puntosHTML = this.destinos.map(destino => `
      <button 
        class="punto-turistico"
        data-id="${destino.id}"
        style="top: ${destino.mapTop}%; left: ${destino.mapLeft}%"
        aria-label="${destino.nombre}">
        <span class="tooltip">${destino.nombre}</span>
      </button>
    `).join("");

    const cssUrl = new URL('../css/mapa-provincia.css', import.meta.url).href;
    
    // Configurar contenido en el template a nivel de módulo
    template.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

      <section class="contenedor">
        <h1>${this.region}</h1>
        <p>Seleccioná un punto turístico dentro de la provincia.</p>

        <div class="card">
          <div class="mapa">
            <img src="${imagen}" alt="Mapa de ${this.region}">
            ${puntosHTML}
          </div>
        </div>

        <div class="lista">
          ${this.destinos.map(destino => {
            const actividadesHTML = destino.actividades && destino.actividades.length > 0
              ? `<div class="destino-tags">
                  ${destino.actividades.map(act => `<span class="destino-tag">${act.nombre || act}</span>`).slice(0, 3).join("")}
                 </div>`
              : '';
            return `
              <article class="destino" data-id="${destino.id}" tabindex="0" role="button" aria-label="Ver ${destino.nombre}">
                <div class="destino-img">
                  <img src="../${destino.imagen_portada}" alt="${destino.nombre}" loading="lazy">
                </div>
                <div class="destino-body">
                  <h3>${destino.nombre}</h3>
                  <div class="destino-meta">
                    <span class="destino-region">📍 ${destino.region}</span>
                  </div>
                  ${actividadesHTML}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  addEvents() {
    const puntos = this.shadowRoot.querySelectorAll(".punto-turistico");
    const tarjetas = this.shadowRoot.querySelectorAll(".destino");

    const irADestino = (id) => {
      window.location.href = `../destino/?id=${encodeURIComponent(id)}&region=${encodeURIComponent(this.region)}`;
    };

    const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

    puntos.forEach(punto => {
      if (isTouchDevice()) {
        // En móviles: primer tap muestra tooltip, segundo tap redirige
        punto.addEventListener("click", (e) => {
          const yaActivo = punto.classList.contains("activo");

          // Cerrar otros tooltips activos
          puntos.forEach(p => p.classList.remove("activo"));

          if (yaActivo) {
            // Segundo tap — redirige
            irADestino(punto.dataset.id);
          } else {
            // Primer tap — muestra tooltip
            e.preventDefault();
            punto.classList.add("activo");

            // Ocultar después de 2.5s si el usuario no pulsa otra vez
            setTimeout(() => {
              punto.classList.remove("activo");
            }, 2500);
          }
        });
      } else {
        // En computadoras: clic directo redirige
        punto.addEventListener("click", () => {
          irADestino(punto.dataset.id);
        });
      }
    });

    tarjetas.forEach(tarjeta => {
      tarjeta.addEventListener("click", () => {
        irADestino(tarjeta.dataset.id);
      });

      tarjeta.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          irADestino(tarjeta.dataset.id);
        }
      });
    });

    // 3D Tilt Effect para las tarjetas de la lista
    const shadow = this.shadowRoot;
    const cards = shadow.querySelectorAll(".destino");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.transition = "transform 0.1s ease-out";
        card.style.zIndex = "5";
      });
      card.style.willChange = "transform";
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        card.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.zIndex = "1";
      });
    });
  }
}

customElements.define("mapa-provincia", MapaProvincia);
