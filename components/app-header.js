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
    const cssUrl = new URL('../css/app-header.css', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

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
        const provinciaUrl = new URL('../provincia/', import.meta.url).href;
        window.location.href = `${provinciaUrl}?region=${encodeURIComponent(region)}`;
      });
    });
  }
}

customElements.define("app-header", AppHeader);