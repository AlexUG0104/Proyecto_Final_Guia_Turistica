class AudioGuia extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['src', 'label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const src = this.getAttribute('src');
    const label = this.getAttribute('label') || 'Audio del destino';

    if (!src || src === "null" || src === "") {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const cssUrl = new URL('../css/audio-guia.css', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">
      <div class="audio-container">
        <span class="audio-label">🔊 ${label}</span>
        <audio controls>
          <source src="${src}" type="audio/mpeg">
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    `;
  }
}

customElements.define("audio-guia", AudioGuia);
