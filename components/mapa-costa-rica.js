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
          position: absolute;
          width: 35px;  /* Ajustado un poquito para que sea más fácil darle clic */
          height: 35px;
          background: transparent;
          border: none; /* ¡Esto elimina el círculo negro del botón! */
          outline: none; /* Esto evita que salga un borde azul al darle clic */
          border-radius: 50%;
          cursor: pointer;
          /* translate(-50%, -50%) centra el botón exactamente en la coordenada top/left */
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        /* Highlight / Brillo transparente */
        .zona::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease-in-out;
          opacity: 0; 
          box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.8);
          pointer-events: none; 
        }

        .zona:hover::before {
          width: 45px;
          height: 45px;
          opacity: 1; 
        }

        .zona:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }

        /* Highlight / Brillo transparente */
        .zona::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transform: translate(-50%, 50%);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          opacity: 0; /* Opacidad inicial de 0 como requerido */
          box-shadow: 0 0 20px 8px rgba(255, 255, 255, 0.9);
          pointer-events: none; /* Que el brillo no estorbe el hitbox del pin */
        }

        .zona:hover::before {
          width: 45px;
          height: 45px;
          opacity: 1; /* Transición suave a 1 solo al hacer hover en el pin */
        }

        /* Solo se anima visualmente el glow y el pin se agranda sutilmente */
        .zona:hover {
          transform: translate(-50%, -100%) scale(1.15) translateY(-2px);
        }

        /* Coordenadas ajustadas: top y left ahora apuntan a la punta inferior del pin. */
        /* Puntarenas tiene una zona interactiva extra ancha para facilitar el clic. */
        .guanacaste { top: 38%; left: 24%; }
        .alajuela   { top: 35%; left: 45%; }
        .heredia    { top: 36%; left: 58%; }
        .limon      { top: 58%; left: 77%; }
        .san-jose   { top: 54%; left: 51%; }
        .cartago    { top: 54%; left: 63%; }
        
        /* Ajuste específico y hitbox expandido para Puntarenas */
        .puntarenas { 
          top: 76%; 
          left: 60%; 
          width: 35px; /* Reducido para evitar conflicto */
          height: 35px; 
        }
      </style>

      <div class="mapa">
        <img src="assents/img/mapa-cr.png" alt="Mapa de Costa Rica por provincias">

        <button id="guanacaste" class="zona guanacaste" data-region="Guanacaste" aria-label="Guanacaste"></button>
        <button id="alajuela" class="zona alajuela" data-region="Alajuela" aria-label="Alajuela"></button>
        <button id="heredia" class="zona heredia" data-region="Heredia" aria-label="Heredia"></button>
        <button id="limon" class="zona limon" data-region="Limón" aria-label="Limón"></button>
        <button id="san-jose" class="zona san-jose" data-region="San José" aria-label="San José"></button>
        <button id="cartago" class="zona cartago" data-region="Cartago" aria-label="Cartago"></button>
        <button id="puntarenas" class="zona puntarenas" data-region="Puntarenas" aria-label="Puntarenas"></button>
      </div>
    `;
  }

  addEvents() {
    const zonas = this.shadowRoot.querySelectorAll(".zona");

    zonas.forEach((zona) => {
      zona.addEventListener("click", () => {
        const region = zona.dataset.region;
        const id = zona.id;

        // Disparamos el CustomEvent para lógica posterior
        this.dispatchEvent(new CustomEvent("provincia-seleccionada", {
          detail: { id: id, region: region },
          bubbles: true,
          composed: true
        }));

        // IMPORTANTE: sin "/" para GitHub Pages
        window.location.href = `provincia/?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("mapa-costa-rica", MapaCostaRica);