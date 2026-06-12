class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.particleInterval = null;
  }

  connectedCallback() {
    this.render();
    this.initMagicMode();
    this.addEvents();
  }

  disconnectedCallback() {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
  }

  render() {
    const cssUrl = new URL('../css/app-header.css', import.meta.url).href;
    const homeUrl = new URL('../index.html', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

      <header>
        <a href="${homeUrl}" class="logo-link">
          <h2>Guía <span>CR</span></h2>
        </a>
        <nav>
          <button data-region="Limón">Caribe</button>
          <button data-region="Guanacaste">Guanacaste</button>
          <button data-region="San José">Central</button>
          <button data-region="Puntarenas">Sur</button>
          <button id="btn-sorpresa" class="btn-sorpresa">
            <span>¡Destino Sorpresa! 🎲</span>
          </button>
        </nav>
      </header>

      <button class="btn-magico" id="btnMagico">
        Experiencia Mágica ✨
      </button>
    `;
  }

  initMagicMode() {
    const isMagic = localStorage.getItem("magic-mode") === "true";
    const body = document.body;
    
    if (isMagic) {
      body.classList.add("magic-mode");
      const btn = this.shadowRoot.getElementById("btnMagico");
      if (btn) {
        btn.classList.add("active");
        btn.innerHTML = "Apagar Magia 🌙";
      }
      this.startGlobalParticles();
    }
  }

  startGlobalParticles() {
    let container = document.querySelector(".particles-container");
    if (!container) {
      container = document.createElement("div");
      container.classList.add("particles-container");
      document.body.appendChild(container);
    }
    
    if (this.particleInterval) clearInterval(this.particleInterval);
    
    this.particleInterval = setInterval(() => {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.width = Math.random() * 6 + 2 + "px";
      particle.style.height = particle.style.width;
      particle.style.animationDuration = Math.random() * 3 + 2 + "s";
      particle.style.opacity = Math.random();
      container.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 150);
  }

  stopGlobalParticles() {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
      this.particleInterval = null;
    }
    const container = document.querySelector(".particles-container");
    if (container) {
      container.remove();
    }
  }

  addEvents() {
    const buttons = this.shadowRoot.querySelectorAll("nav button:not(#btn-sorpresa)");
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
        btnSorpresa.textContent = "Buscando... 🔍";
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
          btnSorpresa.innerHTML = `<span>¡Destino Sorpresa! 🎲</span>`;
          btnSorpresa.classList.remove("animando");
        }
      });
    }

    const btnMagico = this.shadowRoot.getElementById("btnMagico");
    if (btnMagico) {
      btnMagico.addEventListener("click", () => {
        const isMagic = !document.body.classList.contains("magic-mode");
        document.body.classList.toggle("magic-mode", isMagic);
        localStorage.setItem("magic-mode", isMagic ? "true" : "false");
        
        if (isMagic) {
          btnMagico.classList.add("active");
          btnMagico.innerHTML = "Apagar Magia 🌙";
          this.startGlobalParticles();
        } else {
          btnMagico.classList.remove("active");
          btnMagico.innerHTML = "Experiencia Mágica ✨";
          this.stopGlobalParticles();
        }
      });
    }
  }
}

customElements.define("app-header", AppHeader);