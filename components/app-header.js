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
          <button id="nav-inicio" class="nav-tab active">Inicio</button>
          <button id="nav-explorar" class="nav-tab">Explorador</button>
          <div class="explorar-controls" id="explorar-controls">
            <span class="nav-separator">|</span>
            <button data-region="Limón">Caribe</button>
            <button data-region="Guanacaste">Guanacaste</button>
            <button data-region="San José">Central</button>
            <button data-region="Puntarenas">Sur</button>
            <button id="btn-sorpresa" class="btn-sorpresa">
              <span>¡Destino Sorpresa! 🎲</span>
            </button>
          </div>
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

  actualizarControlesVisibilidad(tab) {
    const controls = this.shadowRoot.getElementById("explorar-controls");
    if (!controls) return;
    
    const isSubpage = window.location.pathname.includes("/provincia/") || window.location.pathname.includes("/destino/");
    
    if (isSubpage) {
      controls.classList.remove("oculto");
    } else {
      if (tab === "inicio") {
        controls.classList.add("oculto");
      } else {
        controls.classList.remove("oculto");
      }
    }
  }

  addEvents() {
    const buttons = this.shadowRoot.querySelectorAll("nav button[data-region]");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const region = btn.dataset.region;
        const provinciaUrl = new URL('../provincia/', import.meta.url).href;
        window.location.href = `${provinciaUrl}?region=${encodeURIComponent(region)}`;
      });
    });

    const isSubpage = window.location.pathname.includes("/provincia/") || window.location.pathname.includes("/destino/");
    const navInicio = this.shadowRoot.getElementById("nav-inicio");
    const navExplorar = this.shadowRoot.getElementById("nav-explorar");

    if (navInicio && navExplorar) {
      navInicio.addEventListener("click", () => {
        if (isSubpage) {
          window.location.href = `../index.html?tab=inicio`;
        } else {
          window.dispatchEvent(new CustomEvent("tab-changed", { detail: { tab: 'inicio' } }));
        }
      });

      navExplorar.addEventListener("click", () => {
        if (isSubpage) {
          window.location.href = `../index.html?tab=mapa`;
        } else {
          window.dispatchEvent(new CustomEvent("tab-changed", { detail: { tab: 'mapa' } }));
        }
      });
    }

    // Listen to tab changes globally to sync active class on header buttons
    window.addEventListener("tab-changed", (event) => {
      if (!navInicio || !navExplorar) return;
      const activeTab = event.detail.tab;
      if (activeTab === 'inicio') {
        navInicio.classList.add("active");
        navExplorar.classList.remove("active");
      } else {
        navInicio.classList.remove("active");
        navExplorar.classList.add("active");
      }
      this.actualizarControlesVisibilidad(activeTab);
    });

    // Set initial active state
    if (navInicio && navExplorar) {
      if (isSubpage) {
        navInicio.classList.remove("active");
        navExplorar.classList.add("active");
        this.actualizarControlesVisibilidad("mapa");
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const initialTab = urlParams.get("tab") || "inicio";
        if (initialTab === "mapa") {
          navInicio.classList.remove("active");
          navExplorar.classList.add("active");
        } else {
          navInicio.classList.add("active");
          navExplorar.classList.remove("active");
        }
        this.actualizarControlesVisibilidad(initialTab);
      }
    }

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