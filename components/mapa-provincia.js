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
      "Guanacaste": "../assents/img/Mapa_de_Guanacaste_cantones.jpg",
      "Alajuela": "../assents/img/Alajuelacantones.png",
      "Heredia": "../assents/img/heredia-cantones.gif",
      "San José": "../assents/img/SanJoseCantones.png",
      "Cartago": "../assents/img/cartagocantones.png",
      "Limón": "../assents/img/limoncantones.gif",
      "Puntarenas": "../assents/img/Puntarenascantones.png"
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

    if (!this.region || !imagen) {
      this.shadowRoot.innerHTML = `
        <h1>Error</h1>
        <p>No se encontró la provincia seleccionada.</p>
        <a href="/">Volver</a>
      `;
      return;
    }

    const puntosHTML = this.destinos.map(destino => `
      <button 
        class="punto-turistico"
        data-id="${destino.id}"
        style="top: ${destino.mapTop}%; left: ${destino.mapLeft}%"
        aria-label="${destino.nombre}">
        <span>${destino.nombre}</span>
      </button>
    `).join("");

    this.shadowRoot.innerHTML = `
      <style>
        .contenedor {
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          color: #1b4332;
          margin-bottom: 0.5rem;
        }

        p {
          color: #344e41;
          margin-bottom: 2rem;
        }

        .card {
          position: relative;
          width: min(900px, 95%);
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .mapa {
          position: relative;
        }

        img {
          width: 100%;
          display: block;
          border-radius: 15px;
        }

        .punto-turistico {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid white;
          background: #e63946;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,.4);
        }

        .punto-turistico:hover {
          transform: translate(-50%, -50%) scale(1.25);
          background: #ffba08;
        }

        .punto-turistico span {
          position: absolute;
          left: 50%;
          top: 130%;
          transform: translateX(-50%);
          background: #1b4332;
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .lista {
          margin: 1.5rem auto 0;
          width: min(900px, 95%);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .destino {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 8px 20px rgba(0,0,0,.1);
          text-align: left;
        }

        .destino h3 {
          margin: 0 0 0.4rem;
          color: #1b4332;
        }

        .destino p {
          margin: 0;
        }
      </style>

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
          ${this.destinos.map(destino => `
            <article class="destino">
              <h3>${destino.nombre}</h3>
              <p>${destino.region}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  addEvents() {
    const puntos = this.shadowRoot.querySelectorAll(".punto-turistico");

    puntos.forEach(punto => {
      punto.addEventListener("click", () => {
        const id = punto.dataset.id;
       window.location.href = `../destino/?id=${encodeURIComponent(id)}&region=${encodeURIComponent(this.region)}`;
      });
    });
  }
}

customElements.define("mapa-provincia", MapaProvincia);