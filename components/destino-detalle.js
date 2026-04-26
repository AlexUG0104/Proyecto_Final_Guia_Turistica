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

  render() {
    if (!this.destino) {
      this.shadowRoot.innerHTML = `
        <h1>Error</h1>
        <p>No se encontró el destino seleccionado.</p>
        <a href="/">Volver</a>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        .detalle {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,.15);
        }

        .portada {
          width: 100%;
          height: 360px;
          object-fit: cover;
          display: block;
        }

        .contenido {
          padding: 2rem;
        }

        h1 {
          color: #1b4332;
          font-size: 2.5rem;
          margin: 0 0 0.5rem;
        }

        .region {
          color: #2d6a4f;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .descripcion {
          line-height: 1.7;
          color: #344e41;
        }

        .actividades {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 1rem;
        }

        .actividad {
          background: #d8f3dc;
          color: #1b4332;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          font-weight: bold;
        }
      </style>

      <article class="detalle">
        <img 
          class="portada" 
          src="../${this.destino.imagen_portada}" 
          alt="${this.destino.nombre}"
        >

        <div class="contenido">
          <h1>${this.destino.nombre}</h1>
          <p class="region">${this.destino.region}</p>

          <p class="descripcion">${this.destino.descripcion}</p>

          <div class="actividades">
            ${this.destino.actividades.map(act => `
              <span class="actividad">${act}</span>
            `).join("")}
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("destino-detalle", DestinoDetalle);