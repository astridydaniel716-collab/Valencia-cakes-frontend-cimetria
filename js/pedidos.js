const API_URL = "http://localhost:3330/app/pedidos";

const tbodyPedidos = document.getElementById("tbodyPedidos");

const modalPedido = document.getElementById("modalPedido");
const modalDetalle = document.getElementById("modalDetalle");
const modalCliente = document.getElementById("modalCliente");

const formPedido = document.getElementById("formPedido");
const formCliente = document.getElementById("formCliente");

const clienteSelect = document.getElementById("cliente_id");
const estadoSelect = document.getElementById("estado");

const contenedorProductos = document.getElementById("contenedorProductos");
const totalPedido = document.getElementById("totalPedido");

const btnAbrirModalPedido = document.getElementById("btnAbrirModalPedido");
const btnAgregarProducto = document.getElementById("btnAgregarProducto");

const btnCerrarModal = document.getElementById("cerrarModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");

const btnCerrarDetalle = document.getElementById("cerrarDetalle");

const btnNuevoCliente = document.getElementById("btnNuevoCliente");
const btnCerrarModalCliente = document.getElementById("cerrarModalCliente");

let productosDB = [];
let clientesDB = [];
let detallesPedido = [];

// ==============================
// INIT
// ==============================
window.addEventListener("DOMContentLoaded", async () => {

    validarAcceso();

    await cargarProductos();
    await cargarClientes();
    await cargarPedidos();

});


// ==============================
// VALIDAR ACCESO
// ==============================

function validarAcceso() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../index.html";
        return;
    }

    const rolesPermitidos = ["admin", "vendedor"];

    if (!rolesPermitidos.includes(usuario.rol)) {

        alert("No tienes permisos");

        window.location.href = "./index.html";
    }
}

// ==============================
// CARGAR PEDIDOS
// ==============================

async function cargarPedidos() {

    try {

        const response = await fetch(`${API_URL}/pedidos`);

        const pedidos = await response.json();

        tbodyPedidos.innerHTML = "";

        pedidos.forEach((pedido, index) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${pedido.cliente_nombre}</td>
                <td>${formatearFecha(pedido.fecha)}</td>
                <td>$${pedido.total}</td>
                <td>
                    <span class="estado ${pedido.estado}">
                        ${pedido.estado}
                    </span>
                </td>

                <td>
                    <div class="acciones">

                        <button class="btn-table btn-view">
                            <i class="fa-solid fa-eye"></i>
                        </button>

                        <button class="btn-table btn-edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button class="btn-table btn-delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
                </td>
            `;

            const btnView = tr.querySelector(".btn-view");
            const btnEdit = tr.querySelector(".btn-edit");
            const btnDelete = tr.querySelector(".btn-delete");

            btnView.addEventListener("click", () => {
                verDetallePedido(pedido.idpedido);
            });

            btnEdit.addEventListener("click", () => {
                editarPedido(pedido.idpedido);
            });

            btnDelete.addEventListener("click", () => {
                eliminarPedido(pedido.idpedido);
            });

            tbodyPedidos.appendChild(tr);

        });

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// CARGAR PRODUCTOS
// ==============================

async function cargarProductos() {

    try {

        const response = await fetch(`${API_URL}/productos`);

        productosDB = await response.json();

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// CARGAR CLIENTES
// ==============================

async function cargarClientes() {

    try {

        const response = await fetch(`${API_URL}/clientes`);

        const res = await response.json(); clientesDB = res.data || res;

        clienteSelect.innerHTML = "";

        const optionDefault = document.createElement("option");

        optionDefault.value = "";
        optionDefault.textContent = "Seleccione un cliente";

        clienteSelect.appendChild(optionDefault);

        clientesDB.forEach(cliente => {

            const option = document.createElement("option");

            option.value = cliente.id;
            option.textContent = cliente.nombre;

            clienteSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// MODAL PEDIDO
// ==============================

btnAbrirModalPedido.addEventListener("click", abrirModalNuevoPedido);

function abrirModalNuevoPedido() {

    document.getElementById("tituloModal").textContent =
        "Nuevo Pedido";

    formPedido.reset();

    document.getElementById("pedidoId").value = "";

    detallesPedido = [];

    renderProductos();

    actualizarTotal();

    modalPedido.classList.add("active");

}

function cerrarModalPedido() {

    modalPedido.classList.remove("active");

}

btnCerrarModal.addEventListener("click", cerrarModalPedido);

btnCancelarModal.addEventListener("click", cerrarModalPedido);


// ==============================
// AGREGAR PRODUCTO
// ==============================

btnAgregarProducto.addEventListener("click", agregarProductoPedido);

function agregarProductoPedido() {

    detallesPedido.push({
        producto_id: "",
        cantidad: 1,
        precio: 0,
        subtotal: 0
    });

    renderProductos();

}


// ==============================
// RENDER PRODUCTOS
// ==============================

function renderProductos() {

    contenedorProductos.innerHTML = "";

    detallesPedido.forEach((detalle, index) => {

        const row = document.createElement("div");

        row.classList.add("producto-item");

        const selectProducto = document.createElement("select");

        const optionDefault = document.createElement("option");

        optionDefault.value = "";
        optionDefault.textContent = "Seleccione producto";

        selectProducto.appendChild(optionDefault);

        productosDB.forEach(producto => {

            const option = document.createElement("option");

            option.value = producto.id;
            option.textContent = producto.nombre;

            if (producto.id == detalle.producto_id) {
                option.selected = true;
            }

            selectProducto.appendChild(option);

        });

        const inputCantidad = document.createElement("input");

        inputCantidad.type = "number";
        inputCantidad.min = 1;
        inputCantidad.value = detalle.cantidad;

        const inputSubtotal = document.createElement("input");

        inputSubtotal.type = "text";
        inputSubtotal.disabled = true;
        inputSubtotal.value = `$${detalle.subtotal}`;

        const btnEliminar = document.createElement("button");

        btnEliminar.type = "button";

        btnEliminar.classList.add("btn-delete");

        btnEliminar.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        selectProducto.addEventListener("change", (e) => {

            seleccionarProducto(index, e.target.value);

        });

        inputCantidad.addEventListener("input", (e) => {

            cambiarCantidad(index, e.target.value);

        });

        btnEliminar.addEventListener("click", () => {

            eliminarProducto(index);

        });

        row.appendChild(selectProducto);
        row.appendChild(inputCantidad);
        row.appendChild(inputSubtotal);
        row.appendChild(btnEliminar);

        contenedorProductos.appendChild(row);

    });

}


// ==============================
// SELECCIONAR PRODUCTO
// ==============================

function seleccionarProducto(index, idproducto) {

    const producto = productosDB.find(
        p => p.id == idproducto
    );

    if (!producto) return;

    detallesPedido[index].idproducto = idproducto;

    detallesPedido[index].precio = producto.precio;

    actualizarSubtotal(index);

}


// ==============================
// CAMBIAR CANTIDAD
// ==============================

function cambiarCantidad(index, cantidad) {

    detallesPedido[index].cantidad =
        parseInt(cantidad);

    actualizarSubtotal(index);

}


// ==============================
// SUBTOTAL
// ==============================

function actualizarSubtotal(index) {

    const item = detallesPedido[index];

    item.subtotal =
        item.precio * item.cantidad;

    renderProductos();

    actualizarTotal();

}


// ==============================
// TOTAL
// ==============================

function actualizarTotal() {

    const total = detallesPedido.reduce((acc, item) => {

        return acc + item.subtotal;

    }, 0);

    totalPedido.textContent =
        `$${total.toLocaleString()}`;

}


// ==============================
// ELIMINAR PRODUCTO
// ==============================

function eliminarProducto(index) {

    detallesPedido.splice(index, 1);

    renderProductos();

    actualizarTotal();

}


// ==============================
// GUARDAR PEDIDO
// ==============================

formPedido.addEventListener("submit", guardarPedido);

async function guardarPedido(e) {

    e.preventDefault();

    try {

        const idpedido =
            document.getElementById("idpedido").value;

        const payload = {

            cliente_id: clienteSelect.value,

            estado: estadoSelect.value,

            detalles: detallesPedido

        };

        let endpoint = `${API_URL}/pedidos`;

        let method = "POST";

        if (idpedido) {

            endpoint =
                `${API_URL}/pedidos/${id}`;

            method = "PUT";

        }

        const response = await fetch(endpoint, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        if (!response.ok) {

            throw new Error("Error guardando pedido");

        }

        cerrarModalPedido();

        await cargarPedidos();

        alert("Pedido guardado");

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// EDITAR PEDIDO
// ==============================

async function editarPedido(idpedido) {

    try {

        const response =
            await fetch(`${API_URL}/${idpedido}`);

        const data = await response.json();

        const pedido = data.pedido;

        document.getElementById("tituloModal")
            .textContent = "Editar Pedido";

        document.getElementById("idpedido")
            .value = pedido.idpedido;

        document.getElementById("estado")
            .value = pedido.estado || "";

        document.getElementById("fecha_entrega")
            .value = pedido.fecha_entrega || "";

        document.getElementById("hora_entrega")
            .value = pedido.hora_entrega || "";

        document.getElementById("abono")
            .value = pedido.abono || "";

        document.getElementById("metodo_entrega")
            .value = pedido.metodo_entrega || "";

        document.getElementById("direccion")
            .value = pedido.direccion || "";

        document.getElementById("observaciones")
            .value = pedido.observaciones || "";

        modalPedido.classList.add("active");

    } catch (error) {

        console.error(error);

    }

}

async function guardarEdicionPedido() {

    try {

        const idpedido =
            document.getElementById("idpedido").value;

        const pedido = {

            estado:
                document.getElementById("estado").value,

            fecha_entrega:
                document.getElementById("fecha_entrega").value,

            hora_entrega:
                document.getElementById("hora_entrega").value,

            abono:
                document.getElementById("abono").value,

            metodo_entrega:
                document.getElementById("metodo_entrega").value,

            direccion:
                document.getElementById("direccion").value,

            observaciones:
                document.getElementById("observaciones").value

        };

        const response = await fetch(
            `${API_URL}/editar/${idpedido}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg);
        }

        modalPedido.classList.remove("active");

        await cargarPedidos();

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// ELIMINAR PEDIDO
// ==============================

async function eliminarPedido(idpedido) {

    const confirmar =
        confirm("¿Eliminar pedido?");

    if (!confirmar) return;

    try {
console.log("ID enviado:", idpedido);
        const response =
            await fetch(`${API_URL}/eliminar/${idpedido}`, {

                method: "DELETE"

            });

            const data = await response.json();
            console.log(data);
        if (!response.ok) {

            throw new Error(data.msg);

        }

        await cargarPedidos();

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// VER DETALLE PEDIDO
// ==============================

async function verDetallePedido(idpedido) {

    try {

        if (!idpedido) {
            console.error("ID inválido:", idpedido);
            return;
        }

        const response = await fetch(`${API_URL}/${idpedido}`);

        const data = await response.json();

        console.log("DETALLE PEDIDO RAW:", data);

        // soporta ambos formatos
        const pedido = data.pedido || data;
        const detalles = data.detalles || [];

        if (!pedido) {
            alert("No se encontró el pedido");
            return;
        }

        const container = document.getElementById("detallePedidoContainer");

        container.innerHTML = "";

        // ======================
        // CABECERA
        // ======================
        const info = document.createElement("div");
        info.classList.add("detalle-info");

        info.innerHTML = `
            <p><strong>Cliente:</strong> ${pedido.cliente_nombre || pedido.nombre || "N/A"}</p>
            <p><strong>Fecha:</strong> ${pedido.fecha}</p>
            <p><strong>Total:</strong> $${pedido.total}</p>
        `;

        container.appendChild(info);

        // ======================
        // TABLA DETALLE
        // ======================
        const table = document.createElement("table");

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${detalles.map(d => `
                    <tr>
                        <td>${d.producto}</td>
                        <td>${d.cantidad}</td>
                        <td>$${d.precio}</td>
                        <td>$${d.subtotal}</td>
                    </tr>
                `).join("")}
            </tbody>
        `;

        container.appendChild(table);

        document.getElementById("modalDetalle").classList.add("active");

    } catch (error) {

        console.error("ERROR DETALLE:", error);
    }
}
// ==============================
// CERRAR DETALLE
// ==============================

btnCerrarDetalle.addEventListener("click", () => {

    modalDetalle.classList.remove("active");

});


// ==============================
// MODAL CLIENTE
// ==============================

btnNuevoCliente.addEventListener("click", () => {

    modalCliente.classList.add("active");

});

btnCerrarModalCliente.addEventListener("click", () => {

    modalCliente.classList.remove("active");

});


// ==============================
// CREAR CLIENTE RAPIDO
// ==============================

formCliente.addEventListener("submit", crearCliente);

async function crearCliente(e) {

    e.preventDefault();

    try {

        const payload = {

            nombre:
                document.getElementById("clienteNombre").value,

            telefono:
                document.getElementById("clienteTelefono").value,

            correo:
                document.getElementById("clienteCorreo").value

        };

        const response =
            await fetch(`${API_URL}/clientes`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

        const nuevoCliente = await response.json();

        await cargarClientes();

        clienteSelect.value = nuevoCliente.id;

        modalCliente.classList.remove("active");

        formCliente.reset();

    } catch (error) {

        console.error(error);

    }

}


// ==============================
// UTILIDAD FECHA
// ==============================

function formatearFecha(fecha) {

    return new Date(fecha).toLocaleDateString(
        "es-CO",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    );

}