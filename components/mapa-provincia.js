class MapaProvincia extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.region = this.obtenerRegion();
    this.destinos = [];
  }

  async connectedCallback() {
    await this.cargarDestinos();
    this.render();
    this.addEvents();
  }

  obtenerRegion() {
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
    const respuesta = await fetch("../data/destinos.json");
    const datos = await respuesta.json();

    this.destinos = datos.filter(destino => destino.region === this.region);
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
    this.shadowRoot.innerHTML = `
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
        // On mobile: first tap shows tooltip, second tap navigates
        punto.addEventListener("click", (e) => {
          const yaActivo = punto.classList.contains("activo");

          // Close all other active tooltips
          puntos.forEach(p => p.classList.remove("activo"));

          if (yaActivo) {
            // Second tap — navigate
            irADestino(punto.dataset.id);
          } else {
            // First tap — show tooltip
            e.preventDefault();
            punto.classList.add("activo");

            // Auto-hide tooltip after 2.5s if user doesn't tap again
            setTimeout(() => {
              punto.classList.remove("activo");
            }, 2500);
          }
        });
      } else {
        // On desktop: direct click navigates
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
  }
}

customElements.define("mapa-provincia", MapaProvincia);
