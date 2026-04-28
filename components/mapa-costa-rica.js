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
          background: rgba(255, 255, 255, 0.4);
          padding: 1.5rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .mapa img {
          width: 100%;
          display: block;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(0,0,0,.12);
        }

        .zona {
          all: unset;
          position: absolute;
          width: 60px;
          height: 60px;
          background: transparent;
          border: none;
          outline: none;
          appearance: none;
          border-radius: 50%;
          cursor: pointer;
          transform: translate(-50%, -100%);
          transform-origin: bottom center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }

        .zona:focus,
        .zona:active {
          outline: none;
          border: none;
          box-shadow: none;
        }

        .zona::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          transform: translate(-50%, 50%);
          transition: all 0.35s ease;
          opacity: 0;
          box-shadow: 0 0 20px 8px rgba(255, 255, 255, 0.9);
          pointer-events: none;
        }

        .zona:hover::before {
          width: 50px;
          height: 50px;
          opacity: 1;
        }

        .zona:hover {
          transform: translate(-50%, -100%) scale(1.15) translateY(-5px);
        }

        .zona::after {
          content: attr(data-region);
          position: absolute;
          bottom: 110%;
          left: 50%;
          transform: translate(-50%, 15px);
          background: #1a3c34;
          color: #fff;
          padding: 8px 18px;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .zona:hover::after {
          opacity: 1;
          transform: translate(-50%, -10px);
        }

        .guanacaste { top: 34%; left: 19%; }
        .alajuela   { top: 31%; left: 40%; }
        .heredia    { top: 36%; left: 58%; }
        .limon      { top: 58%; left: 77%; }
        .san-jose   { top: 54%; left: 51%; }
        .cartago    { top: 54%; left: 63%; }

        .puntarenas { 
          top: 76%; 
          left: 60%; 
          width: 80px; 
          height: 80px; 
        }
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
        window.location.href = `provincia/?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("mapa-costa-rica", MapaCostaRica);