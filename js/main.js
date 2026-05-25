const URL_BASE =
    'http://localhost:3330/app/usuarios';

// ===============================
// ELEMENTOS DOM
// ===============================

const loginBox =
    document.getElementById('login-box');

const registerBox =
    document.getElementById('register-box');

const goRegister =
    document.getElementById('go-register');

const goLogin =
    document.getElementById('go-login');

// =======================================
// DETECTAR ?register=true
// =======================================

const params =
    new URLSearchParams(window.location.search);

if (params.get("register") === "true") {

    loginBox.classList.add('hidden');

    registerBox.classList.remove('hidden');

} else {

    registerBox.classList.add('hidden');

    loginBox.classList.remove('hidden');

}

// ===============================
// CAMBIO ENTRE FORMULARIOS
// ===============================

goRegister.addEventListener('click', (e) => {

    e.preventDefault();

    loginBox.classList.add('hidden');

    registerBox.classList.remove('hidden');

});

goLogin.addEventListener('click', (e) => {

    e.preventDefault();

    registerBox.classList.add('hidden');

    loginBox.classList.remove('hidden');

});

// ===============================
// LOGIN
// ===============================

document.getElementById('login-form')
.addEventListener('submit', async (e) => {

    e.preventDefault();

    const correo =
        document.getElementById('login-correo').value;

    const contrasena =
        document.getElementById('login-pass').value;

    try {

        const resp = await fetch(
            `${URL_BASE}/login`,
            {

                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({
                    correo,
                    contrasena
                })

            }
        );

        const data = await resp.json();

        console.log(data);

        if (data.ok) {

            // ===============================
            // GUARDAR SESIÓN
            // ===============================
            localStorage.setItem(
                'usuario',
                JSON.stringify(data.usuario)
            );

            alert(
                `Bienvenido ${data.usuario.nombres}`
            );

            // ===============================
            // REDIRECCIÓN POR ROL
            // ===============================

            if (data.usuario.rol === 'admin') {

                window.location.href =
                    'admin.html';

            }

            else if (
                data.usuario.rol === 'vendedor'
            ) {

                window.location.href =
                    'facturacion.html';

            }

            else {

                // ===============================
                // SI VENÍA DEL CARRITO
                // ===============================
                const volver =
                    localStorage.getItem(
                        'redirigirDespuesLogin'
                    );

                if (volver === 'productos') {

                    localStorage.removeItem(
                        'redirigirDespuesLogin'
                    );

                    window.location.href =
                        'productoscliente.html';

                } else {

                    window.location.href =
                        'productoscliente.html';

                }

            }

        } else {

            alert(
                data.msg ||
                'Credenciales incorrectas'
            );

        }

    } catch (error) {

        console.error(error);

        alert('Error al iniciar sesión');

    }

});

// ===============================
// REGISTRO
// ===============================

document.getElementById('register-form')
.addEventListener('submit', async (e) => {

    e.preventDefault();

    const datos = {

        t1:
            document.getElementById(
                'reg-identificacion'
            ).value,

        t2:
            document.getElementById(
                'reg-nombres'
            ).value,

        t3:
            document.getElementById(
                'reg-telefono'
            ).value,

        t4:
            document.getElementById(
                'reg-correo'
            ).value,

        t5:
            document.getElementById(
                'reg-contrasena'
            ).value

    };

    try {

        const resp = await fetch(
            `${URL_BASE}/crear`,
            {

                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify(datos)

            }
        );

        const data = await resp.json();

        console.log(data);

        if (data.ok) {

            alert(
                'Cuenta creada correctamente'
            );

            // VOLVER AL LOGIN
            registerBox.classList.add('hidden');

            loginBox.classList.remove('hidden');

            // LIMPIAR FORM
            document
                .getElementById('register-form')
                .reset();

        } else {

            alert(data.msg || data.error);

        }

    } catch (error) {

        console.error(error);

        alert('Error al registrar usuario');

    }

});