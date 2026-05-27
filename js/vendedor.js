window.addEventListener('DOMContentLoaded', () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // 🔐 PROTEGER ACCESO
    if (!usuario) {
        window.location.href = '../login.html';
        return;
    }

    if (usuario.rol !== 'vendedor') {
        alert('No autorizado');
        window.location.href = '../login.html';
        return;
    }

    document.getElementById('bienvenida').textContent =
        `Bienvenido ${usuario.nombres} 👋`;

});

//  navegación
function irPedidos() {
    window.location.href = '../pedidos.html';
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '../login.html';
}