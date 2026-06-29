// Crear elemento template a nivel de módulo para cumplir con el criterio "HTML Templates"
const template = document.createElement('template');

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

    // Inyectar HTML dinámico con URLs resueltas en el template
    template.innerHTML = `
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

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

  triggerMagicTransition(callback) {
    let container = document.querySelector(".magic-transition-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "magic-transition-container";
      container.innerHTML = `
        <style>
          .magic-transition-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 100000;
            pointer-events: none;
            display: flex;
          }
          .magic-transition-container .curtain-panel {
            width: 50vw;
            height: 100vh;
            background: linear-gradient(135deg, #051a10 0%, #1a4d33 100%);
            position: absolute;
            top: 0;
            transition: transform 0.55s cubic-bezier(0.76, 0, 0.24, 1);
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            pointer-events: auto;
          }
          .magic-transition-container .curtain-panel.left {
            left: 0;
            transform: translateX(-100%);
            border-right: 2px solid rgba(255, 215, 0, 0.35);
          }
          .magic-transition-container .curtain-panel.right {
            right: 0;
            transform: translateX(100%);
            border-left: 2px solid rgba(255, 215, 0, 0.35);
          }
          .magic-transition-container .curtain-sparkle {
            position: absolute;
            top: 0;
            left: 50%;
            width: 6px;
            height: 100vh;
            background: linear-gradient(to bottom, #ffd700, #ff9f1c, #2ec4b6);
            transform: translate(-50%, -100%);
            box-shadow: 0 0 25px #ffd700, 0 0 50px #ff9f1c, 0 0 100px #2ec4b6;
            transition: transform 0.55s cubic-bezier(0.76, 0, 0.24, 1);
            z-index: 100001;
          }
          
          /* Animación: Curtains meet */
          .magic-transition-container.active .curtain-panel.left {
            transform: translateX(0);
          }
          .magic-transition-container.active .curtain-panel.right {
            transform: translateX(0);
          }
          .magic-transition-container.active .curtain-sparkle {
            transform: translate(-50%, 0);
          }
          
          /* Animación: Curtains split out */
          .magic-transition-container.active.out .curtain-panel.left {
            transform: translateX(-100%);
          }
          .magic-transition-container.active.out .curtain-panel.right {
            transform: translateX(100%);
          }
          .magic-transition-container.active.out .curtain-sparkle {
            transform: translate(-50%, 100%);
            transition: transform 0.65s cubic-bezier(0.76, 0, 0.24, 1);
          }
        </style>
        <div class="curtain-panel left"></div>
        <div class="curtain-panel right"></div>
        <div class="curtain-sparkle"></div>
      `;
      document.body.appendChild(container);
    }

    // Force reflow
    container.offsetHeight;

    // Step 1: Slide in curtains to join in center
    container.classList.add("active");

    // Step 2: At center (550ms), change the background theme class
    setTimeout(() => {
      callback();
      
      // Step 3: Slide out curtains
      container.classList.add("out");
      
      // Step 4: Remove transition element from DOM
      setTimeout(() => {
        container.remove();
      }, 700);
    }, 600);
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

    // Escuchar el cambio global de pestaña
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

    // Estado activo inicial
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
        
        // Ejecutar el cambio de tema con la animación de cortina (Split Screen Curtain)
        this.triggerMagicTransition(() => {
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
      });
    }
  }
}

customElements.define("app-header", AppHeader);