// Chat en tiempo real con Firebase
const Chat = {
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
  username: null,
  isOpen: false,
  unreadCount: 0,
  messagesRef: null,
  stickerPanelOpen: false,
  maxImageSize: 500 * 1024, // 500KB max
  audioContext: null,
  pageLoadTime: Date.now(),

  stickers: [
    '😀', '😂', '🥰', '😎', '🤩', '🥳', '😭', '🤔',
    '👍', '👎', '👏', '🙌', '💪', '❤️', '🔥', '⭐',
    '🎉', '🎊', '🎈', '🎂', '🎁', '🎵', '🎶', '💯',
    '✅', '❌', '⚠️', '💡', '🌟', '💫', '🌈', '☀️',
    '🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
    '👻', '💀', '👽', '🤖', '🤡', '💩', '😈', '👿',
    '🌹', '🌸', '🌺', '🍀', '🌴', '🌵', '🍄', '🌻',
    '🍕', '🍔', '🍟', '🌮', '🍦', '🍩', '☕', '🧃'
  ],

  // Sonido de notificación
  playNotificationSound() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = this.audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Silenciar errores de audio
    }
  },

  openLightbox(src) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = src;
    lightbox.classList.add('show');
  },

  closeLightbox() {
    document.getElementById('imageLightbox').classList.remove('show');
  },

  // Cargar scripts de Firebase
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

  // Inicializar Firebase
  async initFirebase() {
    await this.loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
    await this.loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js');
    
    firebase.initializeApp(this.config);
    this.db = firebase.database();
    this.messagesRef = this.db.ref('chat/messages');
    this.listenForMessages();
  },

  // Crear elementos del chat
  createChatElements() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'chat-toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-comments"></i>';
    toggleBtn.id = 'chatToggle';
    document.body.appendChild(toggleBtn);

    const container = document.createElement('div');
    container.className = 'chat-container';
    container.id = 'chatContainer';
    container.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <i class="fas fa-comments"></i>
          <div>
            <h3>Chat del Blog</h3>
            <span class="chat-header-status">En linea</span>
          </div>
        </div>
        <button class="chat-close-btn" id="chatClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-message other">
          <span class="sender">Sistema</span>
          Bienvenido al chat del Blog 2026! Escribe un mensaje.
          <span class="time">${this.getCurrentTime()}</span>
        </div>
      </div>
      <div class="chat-sticker-panel" id="stickerPanel">
        <div class="sticker-grid">
          ${this.stickers.map(s => `<span class="sticker-item" data-sticker="${s}">${s}</span>`).join('')}
        </div>
      </div>
      <div class="chat-image-preview-bar" id="imagePreviewBar">
        <div class="image-preview-content">
          <img id="previewImg" src="" alt="Preview">
          <button id="removeImage" class="remove-image-btn"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="chat-input-container">
        <div class="chat-input-wrapper">
          <div class="chat-actions-left">
            <button class="chat-action-btn" id="stickerBtn" title="Stickers">
              <i class="fas fa-face-smile"></i>
            </button>
            <button class="chat-action-btn" id="imageBtn" title="Enviar imagen">
              <i class="fas fa-image"></i>
              <input type="file" id="imageInput" accept="image/*" hidden>
            </button>
          </div>
          <input type="text" class="chat-input" id="chatInput" placeholder="Escribe un mensaje..." maxlength="200">
          <button class="chat-send-btn" id="chatSend">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const modal = document.createElement('div');
    modal.className = 'chat-username-modal';
    modal.id = 'usernameModal';
    modal.innerHTML = `
      <div class="chat-username-form">
        <h3>¿Como te llamas?</h3>
        <input type="text" id="usernameInput" placeholder="Tu nombre..." maxlength="15">
        <button id="usernameSubmit">Entrar al chat</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Lightbox para imágenes
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.id = 'imageLightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightboxClose"><i class="fas fa-times"></i></button>
        <img id="lightboxImg" src="" alt="Imagen ampliada">
      </div>
    `;
    document.body.appendChild(lightbox);

    this.addEventListeners();
  },

  addEventListeners() {
    document.getElementById('chatToggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatClose').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatSend').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    document.getElementById('usernameSubmit').addEventListener('click', () => this.setUsername());
    document.getElementById('usernameInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.setUsername();
    });

    // Sticker panel
    document.getElementById('stickerBtn').addEventListener('click', () => this.toggleStickerPanel());
    document.querySelectorAll('.sticker-item').forEach(item => {
      item.addEventListener('click', () => this.sendSticker(item.dataset.sticker));
    });

    // Image upload - click button
    document.getElementById('imageBtn').addEventListener('click', () => {
      document.getElementById('imageInput').click();
    });
    document.getElementById('imageInput').addEventListener('change', (e) => this.handleImageSelect(e));

    // Image paste from clipboard
    document.getElementById('chatInput').addEventListener('paste', (e) => this.handleImagePaste(e));

    // Drag and drop
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.addEventListener('dragover', (e) => {
      e.preventDefault();
      chatMessages.classList.add('drag-over');
    });
    chatMessages.addEventListener('dragleave', () => {
      chatMessages.classList.remove('drag-over');
    });
    chatMessages.addEventListener('drop', (e) => {
      e.preventDefault();
      chatMessages.classList.remove('drag-over');
      this.handleImageDrop(e);
    });

    // Remove image preview
    document.getElementById('removeImage').addEventListener('click', () => this.clearImagePreview());

    // Lightbox
    document.getElementById('lightboxClose').addEventListener('click', () => this.closeLightbox());
    document.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox());

    // Cerrar sticker panel al hacer click fuera
    document.addEventListener('click', (e) => {
      if (this.stickerPanelOpen && 
          !e.target.closest('.chat-sticker-panel') && 
          !e.target.closest('#stickerBtn')) {
        this.toggleStickerPanel();
      }
    });
  },

  setUsername() {
    const input = document.getElementById('usernameInput');
    const name = input.value.trim();
    if (name.length < 2) { input.style.borderColor = '#e74c3c'; return; }
    this.username = name;
    localStorage.setItem('chatUsername', name);
    document.getElementById('usernameModal').style.display = 'none';
    this.addSystemMessage(`${name} se ha unido al chat!`);
  },

  toggleChat() {
    this.isOpen = !this.isOpen;
    document.getElementById('chatContainer').classList.toggle('open', this.isOpen);
    
    // Mostrar/ocultar botón según estado del chat
    const toggleBtn = document.getElementById('chatToggle');
    if (this.isOpen) {
      toggleBtn.style.display = 'none';
      this.unreadCount = 0;
      this.updateBadge();
      document.getElementById('chatInput').focus();
      if (this.stickerPanelOpen) this.toggleStickerPanel();
    } else {
      toggleBtn.style.display = 'flex';
    }
  },

  toggleStickerPanel() {
    this.stickerPanelOpen = !this.stickerPanelOpen;
    document.getElementById('stickerPanel').classList.toggle('open', this.stickerPanelOpen);
    document.getElementById('stickerBtn').classList.toggle('active', this.stickerPanelOpen);
  },

  sendSticker(sticker) {
    if (!this.username) return;
    
    const message = {
      sender: this.username,
      text: sticker,
      time: Date.now(),
      profile: this.getProfile(),
      type: 'sticker'
    };
    
    this.messagesRef.push(message);
    this.toggleStickerPanel();
  },

  // Handle image from file input
  handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) this.processImage(file);
    e.target.value = '';
  },

  // Handle image paste from clipboard
  handleImagePaste(e) {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        this.processImage(file);
        break;
      }
    }
  },

  // Handle image drop
  handleImageDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      this.processImage(files[0]);
    }
  },

  // Process image file
  processImage(file) {
    if (file.size > this.maxImageSize) {
      alert('La imagen es muy grande. Máximo 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      this.showImagePreview(base64);
    };
    reader.readAsDataURL(file);
  },

  // Show image preview before sending
  showImagePreview(base64) {
    this.pendingImage = base64;
    document.getElementById('previewImg').src = base64;
    document.getElementById('imagePreviewBar').classList.add('show');
  },

  // Clear image preview
  clearImagePreview() {
    this.pendingImage = null;
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreviewBar').classList.remove('show');
  },

  // Send image message
  async sendImage() {
    if (!this.pendingImage || !this.username) return;

    const message = {
      sender: this.username,
      text: this.pendingImage,
      time: Date.now(),
      profile: this.getProfile(),
      type: 'image'
    };
    
    try {
      await this.messagesRef.push(message);
      this.clearImagePreview();
    } catch (error) {
      console.error('Error al enviar imagen:', error);
      alert('Error al enviar la imagen. Intenta con una imagen más pequeña.');
    }
  },

  listenForMessages() {
    this.messagesRef.limitToLast(50).on('child_added', (snapshot) => {
      const message = snapshot.val();
      this.displayMessage(message);
      
      // Solo sonar si el mensaje es nuevo (después de cargar la página)
      const isNewMessage = message.time && message.time > this.pageLoadTime;
      
      if (isNewMessage && message.sender !== this.username) {
        this.playNotificationSound();
        
        if (!this.isOpen) {
          this.unreadCount++;
          this.updateBadge();
        }
      }
    });
  },

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    // Si hay imagen pendiente, enviar imagen
    if (this.pendingImage) {
      await this.sendImage();
    }
    
    // Si hay texto, enviar texto
    if (text && this.username) {
      const message = {
        sender: this.username,
        text: text,
        time: Date.now(),
        profile: this.getProfile()
      };
      
      try {
        await this.messagesRef.push(message);
        input.value = '';
      } catch (error) {
        console.error('Error al enviar:', error);
      }
    }
  },

  displayMessage(message) {
    const container = document.getElementById('chatMessages');
    const isMine = message.sender === this.username;
    const messageEl = document.createElement('div');
    
    let content = '';
    
    if (message.type === 'sticker') {
      messageEl.className = `chat-message ${isMine ? 'mine' : 'other'} sticker-message`;
      content = `<span class="sticker-display">${message.text}</span>`;
    } else if (message.type === 'image') {
      messageEl.className = `chat-message ${isMine ? 'mine' : 'other'} image-message`;
      content = `<img src="${message.text}" class="chat-image" loading="lazy" onclick="Chat.openLightbox('${message.text.replace(/'/g, "\\'")}')" />`;
    } else {
      messageEl.className = `chat-message ${isMine ? 'mine' : 'other'}`;
      content = this.escapeHtml(message.text);
    }
    
    messageEl.innerHTML = `
      <span class="sender">${message.sender}</span>
      ${content}
      <span class="time">${this.formatTime(message.time)}</span>
    `;
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
  },

  addSystemMessage(text) {
    const container = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message other';
    messageEl.innerHTML = `
      <span class="sender">Sistema</span>
      ${text}
      <span class="time">${this.getCurrentTime()}</span>
    `;
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
  },

  updateBadge() {
    const toggleBtn = document.getElementById('chatToggle');
    let badge = toggleBtn.querySelector('.badge');
    if (this.unreadCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge';
        toggleBtn.appendChild(badge);
      }
      badge.textContent = this.unreadCount;
    } else if (badge) {
      badge.remove();
    }
  },

  getProfile() {
    const path = window.location.pathname;
    if (path.includes('/thiago/')) return 'thiago';
    if (path.includes('/andrea/')) return 'andrea';
    if (path.includes('/selena/')) return 'selena';
    if (path.includes('/luana/')) return 'luana';
    if (path.includes('/Rihana/')) return 'rihana';
    if (path.includes('/daniel/')) return 'daniel';
    if (path.includes('/Fernando/')) return 'fernando';
    if (path.includes('/doris/')) return 'doris';
    return 'index';
  },

  getCurrentTime() {
    return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  },

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  async init() {
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) this.username = savedUsername;
    
    this.createChatElements();
    
    if (!this.username) {
      document.getElementById('usernameModal').style.display = 'flex';
    } else {
      document.getElementById('usernameModal').style.display = 'none';
    }
    
    // Asegurar que no hay badge al iniciar
    this.unreadCount = 0;
    this.updateBadge();
    
    try {
      await this.initFirebase();
      console.log('Chat conectado a Firebase');
    } catch (error) {
      console.log('Error al conectar con Firebase:', error);
    }
  }
};

Chat.init();
