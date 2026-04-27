class AppHeader extends HTMLElement {
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
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 1rem 2rem;
        }

        header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          color: #1a3c34;
          padding: 1rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          margin: 0;
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: #082f25;
          letter-spacing: 0.5px;
        }

        nav {
          display: flex;
          gap: 1.2rem;
        }

        button {
          background: transparent;
          border: none;
          color: #1a3c34;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.6rem 1.2rem;
          cursor: pointer;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        button::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(45, 106, 79, 0.1);
          border-radius: 999px;
          transform: scale(0);
          transition: transform 0.3s ease;
          z-index: -1;
        }

        button:hover {
          color: #082f25;
          transform: translateY(-2px);
        }

        button:hover::before {
          transform: scale(1);
        }
      </style>

      <header>
        <h2>Guía CR</h2>
        <nav>
          <button data-region="Caribe">Caribe</button>
          <button data-region="Guanacaste">Guanacaste</button>
          <button data-region="Central">Central</button>
          <button data-region="Sur">Sur</button>
        </nav>
      </header>
    `;
  }

  addEvents() {
    const buttons = this.shadowRoot.querySelectorAll("button");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const region = btn.dataset.region;

        this.dispatchEvent(new CustomEvent("region-selected", {
          detail: region,
          bubbles: true,
          composed: true
        }));
      });
    });
  }
}

customElements.define("app-header", AppHeader);