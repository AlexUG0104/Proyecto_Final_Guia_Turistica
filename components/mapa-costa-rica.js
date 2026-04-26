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
    this.shadowRoot.innerHTML = `
      <style>
        .mapa {
          position: relative;
          width: min(850px, 100%);
          margin: 0 auto;
        }

        .mapa img {
          width: 100%;
          display: block;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(0,0,0,.18);
        }

        .zona {
          position: absolute;
          background: transparent;
          border: 2px solid transparent;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }

        .zona:hover {
          border-color: #ffffff;
          background: rgba(255,255,255,.18);
          border-radius: 12px;
        }

        .guanacaste { top: 35%; left: 24%; width: 23%; height: 10%; }
        .alajuela { top: 32%; left: 43%; width: 20%; height: 10%; }
        .heredia { top: 33%; left: 58%; width: 12%; height: 10%; }
        .limon { top: 47%; left: 77%; width: 24%; height: 36%; }
        .san-jose { top: 51%; left: 51%; width: 17%; height: 18%; }
        .cartago { top: 51%; left: 63%; width: 15%; height: 18%; }
        .puntarenas { top: 72%; left: 59%; width: 32%; height: 10%; }
      </style>

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
       window.location.href = `/provincia/?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("mapa-costa-rica", MapaCostaRica);