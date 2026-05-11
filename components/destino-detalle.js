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
          
          ${mapsUrl ? `
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps">
              Cómo llegar
            </a>
          ` : ''}

          ${this.destino.audio ? `<audio-guia src="../${this.destino.audio}" label="Escucha la guía de ${this.destino.nombre}"></audio-guia>` : ''}
        </div>
      </article>
    `;
  }
}

customElements.define("destino-detalle", DestinoDetalle);