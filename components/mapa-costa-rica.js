class MapaCostaRica extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  render() {
    const cssUrl = new URL('../css/mapa-costa-rica.css', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

      <div class="mapa">
        <img src="assents/img/mapa-cr.png" alt="Mapa de Costa Rica por provincias">

        <button class="zona guanacaste" data-region="Guanacaste" aria-label="Guanacaste">Guanacaste</button>
        <button class="zona alajuela" data-region="Alajuela" aria-label="Alajuela">Alajuela</button>
        <button class="zona heredia" data-region="Heredia" aria-label="Heredia">Heredia</button>
        <button class="zona limon" data-region="Limón" aria-label="Limón">Limón</button>
        <button class="zona san-jose" data-region="San José" aria-label="San José">San José</button>
        <button class="zona cartago" data-region="Cartago" aria-label="Cartago">Cartago</button>
        <button class="zona puntarenas" data-region="Puntarenas" aria-label="Puntarenas">Puntarenas</button>
      </div>

      <div class="provincias-grid-mobile">
        <button class="prov-btn" data-region="Guanacaste">🌅 Guanacaste</button>
        <button class="prov-btn" data-region="Alajuela">🌋 Alajuela</button>
        <button class="prov-btn" data-region="Heredia">☕ Heredia</button>
        <button class="prov-btn" data-region="San José">🏙️ San José</button>
        <button class="prov-btn" data-region="Cartago">🏰 Cartago</button>
        <button class="prov-btn" data-region="Limón">🌴 Limón</button>
        <button class="prov-btn" data-region="Puntarenas">🐬 Puntarenas</button>
      </div>
    `;
  }

  addEvents() {
    const zonas = this.shadowRoot.querySelectorAll(".zona, .prov-btn");

    zonas.forEach((zona) => {
      zona.addEventListener("click", () => {
        const region = zona.dataset.region;
        window.location.href = `provincia/?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("mapa-costa-rica", MapaCostaRica);