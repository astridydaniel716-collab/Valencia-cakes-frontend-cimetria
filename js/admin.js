let usuarioEditando = null;
let modoEdicion = false;
let rolActual = "cliente";

// ==========================
// LOGIN CHECK
// ==========================
window.addEventListener('DOMContentLoaded', () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        window.location.href = '../login.html';
        return;
    }

    document.getElementById('nombre-usuario').textContent = usuario.nombres;

    if (usuario.rol !== 'admin') {
        alert('No autorizado');
        window.location.href = '../login.html';
    }
});


// ==========================
// MENÚ
// ==========================
function mostrarSeccion(seccion) {

    const titulo = document.getElementById('titulo-seccion');
    const panel = document.getElementById('panel-contenido');

    if (seccion === 'productos') {

        titulo.textContent = "Gestión de Productos";

        panel.innerHTML = `
            <iframe src="../gestionproductos.html"
                style="width:100%; height:80vh; border:none;"></iframe>
        `;
    }

    else if (seccion === 'vendedores') {

        titulo.textContent = "Vendedores";

        panel.innerHTML = `
            <iframe src="../crearVendedor.html"
                style="width:100%; height:80vh; border:none;"></iframe>
        `;
    }

    else if (seccion === 'facturacion') {

        titulo.textContent = "Facturación";

        panel.innerHTML = `
            <iframe src="../facturacion.html"
                style="width:100%; height:80vh; border:none;"></iframe>
        `;
    }

    else if (seccion === 'usuarios') {

        titulo.textContent = "Gestión de Usuarios";

        panel.innerHTML = `
        <div class="usuarios-container">

            <div class="filtros">

                <button onclick="listarUsuarios('cliente')">Clientes</button>
                <button onclick="listarUsuarios('vendedor')">Vendedores</button>
                <button onclick="listarUsuarios('admin')">Administrador</button>

                <button class="btn-crear" onclick="mostrarFormularioCrear()">
                    + Crear Usuario
                </button>

            </div>

            <!-- FORM -->
            <div id="formularioUsuario" class="formulario hidden">

                <h2 id="tituloFormularioUsuario">Crear Usuario</h2>

                <input id="edit-identificacion" placeholder="Identificación">
                <input id="edit-nombres" placeholder="Nombre">
                <input id="edit-correo" placeholder="Correo">
                <input id="edit-telefono" placeholder="Teléfono">
                <input id="edit-contrasena" type="password" placeholder="Contraseña">

                <select id="edit-rol">
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Admin</option>
                </select>

                <div class="botones-form">

                    <button id="btnGuardarUsuario">Guardar</button>

                    <button class="cancelar"
                        onclick="cancelarEdicionUsuario()">
                        Cancelar
                    </button>

                </div>

            </div>

            <div id="tabla-usuarios"></div>

        </div>
        `;
    }
}


// ==========================
// LISTAR
// ==========================
async function listarUsuarios(rol) {

    rolActual = rol;

    try {

        const resp = await fetch(`http://localhost:3330/modulo/admin/usuarios/${rol}`);
        const data = await resp.json();

        const tabla = document.getElementById('tabla-usuarios');

        let html = `
        <table class="tabla">
            <tr>
                <th>ID</th>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        `;

        data.data.forEach(u => {

            html += `
                <tr>
                    <td>${u.idusuario}</td>
                    <td>${u.identificacion}</td>
                    <td>${u.nombres}</td>
                    <td>${u.correo}</td>
                    <td>${u.telefono}</td>
                    <td>${u.rol}</td>
                    <td class="acciones">

                        <button class="btn-editar"
                            onclick="editarUsuario(
                                '${u.identificacion}',
                                '${u.identificacion}',
                                '${u.nombres}',
                                '${u.correo}',
                                '${u.telefono}',
                                '${u.rol}'
                            )">✏️</button>

                        <button class="btn-eliminar"
                            onclick="eliminarUsuario('${u.identificacion}')">🗑️</button>

                    </td>
                </tr>
            `;
        });

        html += `</table>`;
        tabla.innerHTML = html;

    } catch (err) {
        console.log(err);
    }
}


// ==========================
// CREAR
// ==========================
function mostrarFormularioCrear() {

    modoEdicion = false;
    usuarioEditando = null;

    document.getElementById('formularioUsuario').classList.remove('hidden');
    document.getElementById('tituloFormularioUsuario').textContent = "Crear Usuario";

    limpiarFormulario();
}


// ==========================
// EDITAR
// ==========================
function editarUsuario(id, identificacion, nombres, correo, telefono, rol) {

    modoEdicion = true;
    usuarioEditando = id;

    document.getElementById('formularioUsuario').classList.remove('hidden');
    document.getElementById('tituloFormularioUsuario').textContent = "Editar Usuario";
    document.getElementById('edit-identificacion').value = identificacion;
    document.getElementById('edit-nombres').value = nombres;
    document.getElementById('edit-correo').value = correo;
    document.getElementById('edit-telefono').value = telefono;
    document.getElementById('edit-rol').value = rol;
}


// ==========================
// GUARDAR (CREAR / EDITAR)
// ==========================
document.addEventListener('click', async (e) => {

    if (e.target.id !== 'btnGuardarUsuario') return;

    const identificacion = document.getElementById('edit-identificacion').value;
    const nombres = document.getElementById('edit-nombres').value;
    const correo = document.getElementById('edit-correo').value;
    const telefono = document.getElementById('edit-telefono').value;
    const contrasena = document.getElementById('edit-contrasena').value;
    const rol = document.getElementById('edit-rol').value;

    try {

        let url = "";
        let method = "";

        let body = {};

        // ================= EDITAR =================
        if (modoEdicion) {

            url = `http://localhost:3330/modulo/admin/usuario/${usuarioEditando}`;
            method = "PUT";

            body = {
                nombres,
                correo,
                telefono,
                rol
            };

        }

        // ================= CREAR =================
        else {

            url = `http://localhost:3330/modulo/admin/crear-usuario`;
            method = "POST";

            body = {
                t1: identificacion,
                t2: nombres,
                t3: telefono,
                t4: correo,
                t5: contrasena,
                rol
            };
        }

        const resp = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await resp.json();
        console.log(data);

        if (!resp.ok) {
            alert(data.error || data.msg || "Error");
            return;
        }

        cancelarEdicionUsuario();
        listarUsuarios(rolActual);

    } catch (err) {
        console.log(err);
    }
});


// ==========================
// CANCELAR
// ==========================
function cancelarEdicionUsuario() {

    document.getElementById('formularioUsuario').classList.add('hidden');
    limpiarFormulario();
}


// ==========================
// LIMPIAR
// ==========================
function limpiarFormulario() {

    const campos = [
        'edit-identificacion',
        'edit-nombres',
        'edit-correo',
        'edit-telefono',
        'edit-contrasena'
    ];

    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}


// ==========================
// ELIMINAR
// ==========================
async function eliminarUsuario(id) {

    const ok = confirm("¿Eliminar usuario?");
    if (!ok) return;

    await fetch(`http://localhost:3330/modulo/admin/usuario/${id}`, {
        method: "DELETE"
    });

    listarUsuarios(rolActual);
}


// ==========================
// LOGOUT
// ==========================
function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '../login.html';
}