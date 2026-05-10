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

        <button class="zona guanacaste" data-region="Guanacaste" aria-label="Guanacaste"></button>
        <button class="zona alajuela" data-region="Alajuela" aria-label="Alajuela"></button>
        <button class="zona heredia" data-region="Heredia" aria-label="Heredia"></button>
        <button class="zona limon" data-region="Limón" aria-label="Limón"></button>
        <button class="zona san-jose" data-region="San José" aria-label="San José"></button>
        <button class="zona cartago" data-region="Cartago" aria-label="Cartago"></button>
        <button class="zona puntarenas" data-region="Puntarenas" aria-label="Puntarenas"></button>
      </div>
    `;
  }

  addEvents() {
    const zonas = this.shadowRoot.querySelectorAll(".zona");

    zonas.forEach((zona) => {
      zona.addEventListener("click", () => {
        const region = zona.dataset.region;
        window.location.href = `provincia/?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("mapa-costa-rica", MapaCostaRica);