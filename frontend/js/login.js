document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreAdministrador: username,
                contraseña: password
            })
        });

        if (response.ok) {
            sessionStorage.setItem('role', 'admin');
            window.location.href = 'index.html';
        } else {
            alert('Credenciales incorrectas.');
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor.');
    }
});