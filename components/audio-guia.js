// Crear elemento template a nivel de módulo para cumplir con el criterio "HTML Templates"
const template = document.createElement('template');

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
    const label = this.getAttribute('label') || 'Audio guía';

    if (!src || src === "null" || src === "") {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const cssUrl = new URL('../css/audio-guia.css', import.meta.url).href;
    
    // Inyectar HTML en el template
    template.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">
      <div class="audio-card">
        <div class="audio-info">
          <div class="audio-icon">🎧</div>
          <div class="audio-details">
            <span class="audio-title">Audioguía de Viaje</span>
            <span class="audio-subtitle">${label}</span>
          </div>
        </div>
        
        <div class="audio-controls-row">
          <button id="playBtn" class="control-btn play-btn" aria-label="Reproducir">
            <svg id="playIcon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg id="pauseIcon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="display:none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          
          <div class="progress-container">
            <span id="currentTime" class="time-display">00:00</span>
            <input type="range" id="progressBar" class="progress-bar" min="0" max="100" value="0">
            <span id="durationTime" class="time-display">00:00</span>
          </div>
          
          <div class="volume-container">
            <button id="muteBtn" class="volume-btn" aria-label="Silenciar">
              <svg id="volumeIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <input type="range" id="volumeBar" class="volume-bar" min="0" max="100" value="80">
          </div>
        </div>
        
        <audio id="audioElement" preload="metadata">
          <source src="${src}" type="audio/mpeg">
        </audio>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.setupAudioEvents();
  }

  setupAudioEvents() {
    const root = this.shadowRoot;
    const audio = root.getElementById("audioElement");
    const playBtn = root.getElementById("playBtn");
    const playIcon = root.getElementById("playIcon");
    const pauseIcon = root.getElementById("pauseIcon");
    const progressBar = root.getElementById("progressBar");
    const currentTimeDisplay = root.getElementById("currentTime");
    const durationTimeDisplay = root.getElementById("durationTime");
    const muteBtn = root.getElementById("muteBtn");
    const volumeIcon = root.getElementById("volumeIcon");
    const volumeBar = root.getElementById("volumeBar");

    if (!audio || !playBtn) return;

    // Play/Pause logic
    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(err => console.log("Audio play failed or interrupted:", err));
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        playBtn.classList.add("playing");
      } else {
        audio.pause();
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        playBtn.classList.remove("playing");
      }
    });

    const formatTime = (secs) => {
      if (isNaN(secs) || !isFinite(secs)) return "00:00";
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Duration on loaded metadata
    audio.addEventListener("loadedmetadata", () => {
      durationTimeDisplay.textContent = formatTime(audio.duration);
      progressBar.max = Math.floor(audio.duration);
    });

    // Time update progress bar
    audio.addEventListener("timeupdate", () => {
      if (!progressBar.classList.contains("user-seeking")) {
        progressBar.value = Math.floor(audio.currentTime);
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        
        // Gradient fill for custom track
        if (audio.duration) {
          const percentage = (audio.currentTime / audio.duration) * 100;
          progressBar.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, rgba(15, 61, 42, 0.12) ${percentage}%, rgba(15, 61, 42, 0.12) 100%)`;
        }
      }
    });

    // Handle user dragging progress slider
    progressBar.addEventListener("mousedown", () => progressBar.classList.add("user-seeking"));
    progressBar.addEventListener("mouseup", () => {
      progressBar.classList.remove("user-seeking");
      audio.currentTime = progressBar.value;
    });
    progressBar.addEventListener("touchstart", () => progressBar.classList.add("user-seeking"));
    progressBar.addEventListener("touchend", () => {
      progressBar.classList.remove("user-seeking");
      audio.currentTime = progressBar.value;
    });
    progressBar.addEventListener("input", () => {
      currentTimeDisplay.textContent = formatTime(progressBar.value);
    });

    // Volume control slider
    volumeBar.addEventListener("input", () => {
      const vol = volumeBar.value / 100;
      audio.volume = vol;
      this.updateVolumeIcon(vol, volumeIcon);
    });

    // Mute/Unmute toggle
    let lastVolume = 0.8;
    muteBtn.addEventListener("click", () => {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
        this.updateVolumeIcon(0, volumeIcon);
      } else {
        audio.volume = lastVolume;
        volumeBar.value = Math.floor(lastVolume * 100);
        this.updateVolumeIcon(lastVolume, volumeIcon);
      }
    });

    // Restart interface when audio finishes
    audio.addEventListener("ended", () => {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      playBtn.classList.remove("playing");
      progressBar.value = 0;
      audio.currentTime = 0;
      currentTimeDisplay.textContent = "00:00";
      progressBar.style.background = `rgba(15, 61, 42, 0.12)`;
    });
  }

  updateVolumeIcon(vol, iconEl) {
    if (vol === 0) {
      iconEl.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
    } else if (vol < 0.5) {
      iconEl.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
    } else {
      iconEl.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
    }
  }
}

customElements.define("audio-guia", AudioGuia);
