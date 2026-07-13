// Verificación de autenticación
(function() {
  if (sessionStorage.getItem('authenticated') !== 'true') {
    window.location.href = '../login.html';
  }
})();