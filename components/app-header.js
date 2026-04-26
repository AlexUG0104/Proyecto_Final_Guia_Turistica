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
        header {
          background: #2d6a4f;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
        }

        nav {
          display: flex;
          gap: 1rem;
        }

        button {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          border-radius: 5px;
        }

        button:hover {
          background: white;
          color: #2d6a4f;
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