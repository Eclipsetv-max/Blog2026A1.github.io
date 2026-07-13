// Scroll to Top con animación
const ScrollToTop = {
  button: null,
  
  // Detectar perfil actual
  getProfile() {
    const path = window.location.pathname;
    if (path.includes('/thiago/')) return 'thiago';
    if (path.includes('/andrea/')) return 'andrea';
    if (path.includes('/selena/')) return 'selena';
    if (path.includes('/luana/')) return 'luana';
    if (path.includes('/Rihana/')) return 'rihana';
    if (path.includes('/daniel/')) return 'daniel';
    if (path.includes('/Fernando/')) return 'fernando';
    return 'index';
  },

  // Crear el botón
  createButton() {
    const profile = this.getProfile();
    
    this.button = document.createElement('button');
    this.button.className = `scroll-top-btn ${profile}`;
    this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    this.button.setAttribute('aria-label', 'Volver arriba');
    this.button.title = 'Volver arriba';
    
    document.body.appendChild(this.button);
  },

  // Mostrar/ocultar botón según scroll
  toggleVisibility() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  },

  // Scroll suave hacia arriba
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  // Inicializar
  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
      return;
    }

    this.createButton();
    
    // Evento de scroll
    window.addEventListener('scroll', () => this.toggleVisibility());
    
    // Evento de click
    this.button.addEventListener('click', () => this.scrollToTop());
  }
};

// Auto-inicializar
ScrollToTop.init();