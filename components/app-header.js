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
        <a href="/" style="text-decoration: none;"><h2>Guía CR</h2></a>
        <nav>
          <button data-region="Limón">Caribe</button>
          <button data-region="Guanacaste">Guanacaste</button>
          <button data-region="San José">Central</button>
          <button data-region="Puntarenas">Sur</button>
          <button id="btn-sorpresa" class="btn-sorpresa">¡Destino Sorpresa!</button>
        </nav>
      </header>
    `;
  }

  addEvents() {
    const buttons = this.shadowRoot.querySelectorAll("button:not(#btn-sorpresa)");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const region = btn.dataset.region;
        const provinciaUrl = new URL('../provincia/', import.meta.url).href;
        window.location.href = `${provinciaUrl}?region=${encodeURIComponent(region)}`;
      });
    });

    const btnSorpresa = this.shadowRoot.getElementById("btn-sorpresa");
    if (btnSorpresa) {
      btnSorpresa.addEventListener("click", async () => {
        btnSorpresa.textContent = "Buscando...";
        btnSorpresa.classList.add("animando");
        try {
          const dataUrl = new URL('../data/destinos.json', import.meta.url).href;
          const respuesta = await fetch(dataUrl);
          const destinos = await respuesta.json();
          const aleatorio = destinos[Math.floor(Math.random() * destinos.length)];
          const destinoUrl = new URL('../destino/', import.meta.url).href;
          window.location.href = `${destinoUrl}?id=${encodeURIComponent(aleatorio.id)}&region=${encodeURIComponent(aleatorio.region)}`;
        } catch (error) {
          console.error("Error obteniendo destino sorpresa:", error);
          btnSorpresa.textContent = " ¡Destino Sorpresa!";
          btnSorpresa.classList.remove("animando");
        }
      });
    }
  }
}

customElements.define("app-header", AppHeader);