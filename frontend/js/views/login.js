document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar si el botón presionado es el de admin login
    const isAdminLogin = e.submitter && e.submitter.id === 'admin-login-button';

    if (isAdminLogin) {
        if (username === 'admin' && password === 'admin') {
            sessionStorage.setItem('role', 'admin');
            window.location.href = 'index.html';
        } else {
            alert('Credenciales de administrador incorrectas.');
        }
    } else {
        if (username === 'user' && password === 'user') {
            sessionStorage.setItem('role', 'user');
            window.location.href = 'index.html';
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    }
});
