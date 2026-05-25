window.addEventListener('DOMContentLoaded', () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // 🔐 SOLO ADMIN
    if (!usuario || usuario.rol !== 'admin') {

        alert('Acceso denegado');

        window.location.href = './login.html';

    }

});

// CREAR VENDEDOR

async function crearVendedor() {

    const body = {

        t1: document.getElementById('identificacion').value,

        t2: document.getElementById('nombres').value,

        t3: document.getElementById('telefono').value,

        t4: document.getElementById('correo').value,

        t5: document.getElementById('contrasena').value

    };

    try {

        const response = await fetch(
            'http://localhost:3330/modulo/admin/crear-vendedor',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (data.ok) {

            alert('Vendedor creado correctamente');

            limpiarFormulario();

        } else {

            alert(data.msg || data.error);

        }

    } catch (error) {

        console.error(error);

        alert('Error del servidor');

    }

}

// CAMBIAR ROL

async function cambiarRol() {

    const identificacion =
        document.getElementById('identificacionRol').value;

    const rol =
        document.getElementById('rol').value;

    try {

        const response = await fetch(
            `http://localhost:3330/modulo/admin/rol/${identificacion}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    rol
                })
            }
        );

        const data = await response.json();

        if (data.ok) {

            alert('Rol actualizado correctamente');

            document.getElementById('identificacionRol').value = '';

        } else {

            alert(data.msg);

        }

    } catch (error) {

        console.error(error);

        alert('Error del servidor');

    }

}

// LIMPIAR FORMULARIO

function limpiarFormulario() {

    document.getElementById('identificacion').value = '';

    document.getElementById('nombres').value = '';

    document.getElementById('telefono').value = '';

    document.getElementById('correo').value = '';

    document.getElementById('contrasena').value = '';

}