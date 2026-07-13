// Contador de visitas usando Firebase Realtime Database (tiempo real)
const VisitCounter = {
  config: {
    apiKey: "AIzaSyAwJQTdg8gEkcwbkyLCCwHW0hNKXQkhTK4",
    authDomain: "blog2026-chat.firebaseapp.com",
    databaseURL: "https://blog2026-chat-default-rtdb.firebaseio.com",
    projectId: "blog2026-chat",
    storageBucket: "blog2026-chat.firebasestorage.app",
    messagingSenderId: "741793960053",
    appId: "1:741793960053:web:32047580efc04a7ac9e83c"
  },

  db: null,
  currentProfile: null,

  // IDs únicos por perfil
  profiles: {
    'thiago': 'thiago',
    'andrea': 'andrea',
    'selena': 'selena',
    'luana': 'luana',
    'rihana': 'rihana',
    'daniel': 'daniel',
    'fernando': 'fernando',
    'doris': 'doris',
    'index': 'index-principal'
  },

  // Cargar script de Firebase
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Obtener perfil actual desde la URL
  getCurrentProfile() {
    const path = window.location.pathname;
    for (const [key, value] of Object.entries(this.profiles)) {
      if (path.includes(`/${value}/`) || path.endsWith(`/${value}`)) {
        return value;
      }
    }
    if (path.endsWith('/index.html') || path.endsWith('/') || path.endsWith('Blog 2026')) {
      return 'index-principal';
    }
    return null;
  },

  // Formatear número con separadores
  formatNumber(num) {
    if (num === null || num === undefined) return '...';
    return num.toLocaleString('es-PE');
  },

  // Incrementar contador
  async increment(profile) {
    if (!profile || !this.db) return null;

    try {
      const countRef = this.db.ref(`visitas/${profile}`);

      await countRef.transaction((current) => {
        return (current || 0) + 1;
      });
    } catch (error) {
      console.log('Error al contar visita:', error);
    }
  },

  // Escuchar cambios en tiempo real
  listenForChanges(profile) {
    if (!profile || !this.db) return;

    const countRef = this.db.ref(`visitas/${profile}`);

    // onValue se ejecuta cada vez que el valor cambia (en tiempo real)
    countRef.on('value', (snapshot) => {
      const count = snapshot.val();
      const countElement = document.getElementById(`visit-count-${profile}`);
      if (countElement) {
        countElement.textContent = this.formatNumber(count);
        countElement.classList.add('loaded');
      }
    });
  },

  // Crear elemento HTML del contador
  createCounterElement(profile) {
    const container = document.createElement('div');
    container.className = 'visit-counter';
    container.innerHTML = `
      <div class="counter-wrapper">
        <i class="fas fa-eye counter-icon"></i>
        <span class="counter-label">Visitas</span>
        <span class="counter-value" id="visit-count-${profile}">...</span>
      </div>
    `;
    return container;
  },

  // Inicializar contador en la página
  async init() {
    // Cargar Firebase
    await this.loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
    await this.loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js');

    // Inicializar Firebase (solo si no está inicializado)
    if (!firebase.apps.length) {
      firebase.initializeApp(this.config);
    }
    this.db = firebase.database();

    const profile = this.getCurrentProfile();
    if (!profile) return;
    this.currentProfile = profile;

    // Buscar o crear contenedor del contador
    let counterContainer = document.querySelector('.visit-counter');
    if (!counterContainer) {
      const footer = document.querySelector('.footer');
      if (footer) {
        counterContainer = this.createCounterElement(profile);
        footer.insertBefore(counterContainer, footer.firstChild);
      }
    }

    // Incrementar contador
    await this.increment(profile);

    // Escuchar cambios en tiempo real
    this.listenForChanges(profile);
  }
};

// Auto-inicializar
VisitCounter.init();
