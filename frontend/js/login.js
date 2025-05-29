document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('role', 'admin');
      window.location.href = 'index.html';
  } else {
      alert('Credenciales de administrador incorrectas.');
  }
});