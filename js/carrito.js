const API =
    "http://localhost:3330/app/productos";


// ==========================
// IMÁGENES PRODUCTOS
// ==========================
const imagenesProductos = {

    brownies:
        "imagenes/Brownies.jpg",

    galletas:
        "imagenes/galleta.jfif",

    quesillo:
        "imagenes/quesillo.jfif",

    "3leches":
        "imagenes/refrigerada.png",

    refrigerada:
        "imagenes/refrigerada.png",

    cupcakes:
        "imagenes/cupcakes.jpg",

    personalizada:
        "imagenes/personalizada4.png"

};


// ==========================
// ELEMENTOS HTML
// ==========================
const contenedorProductos =
    document.getElementById("contenedor-productos");

const listaCarrito =
    document.getElementById("lista-carrito");

const totalElemento =
    document.getElementById("total");

const contadorCarrito =
    document.getElementById("contador-carrito");

const btnVaciar =
    document.getElementById("vaciar-carrito");

const carritoPanel =
    document.getElementById("carrito");

const btnCarrito =
    document.getElementById("btn-carrito");

const btnCerrarSesion =
    document.getElementById("cerrar-sesion");

const btnCerrarCarrito =
    document.getElementById("btn-cerrar-carrito");


// ==========================
// USUARIO
// ==========================
function obtenerUsuario() {

    try {

        const usuario =
            JSON.parse(
                localStorage.getItem("usuario")
            );

        if (!usuario || !usuario.idusuario) {

            return null;

        }

        return usuario;

    } catch {

        return null;

    }

}


// ==========================
// CARRITO
// ==========================
let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


// ==========================
// GUARDAR CARRITO
// ==========================
function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// ==========================
// OBTENER PRODUCTOS
// ==========================
async function obtenerProductos() {

    try {

        const response =
            await fetch(`${API}/todos`);

        const data =
            await response.json();

        renderizarProductos(data.data);

    } catch (error) {

        console.log(error);

    }

}


// ==========================
// RENDERIZAR PRODUCTOS
// ==========================
function renderizarProductos(productos) {

    let grupos = {};

    // ======================
    // AGRUPAR PRODUCTOS
    // ======================
    productos.forEach(producto => {

        let categoria = "";

        // QUESILLO
        if (
            producto.nombre.toLowerCase()
            .includes("quesillo")
        ) {

            categoria = "quesillo";

        }

        // 3 LECHES
        else if (
            producto.nombre.toLowerCase()
            .includes("3 leches")
        ) {

            categoria = "3leches";

        }

        // REFRIGERADA
        else if (
            producto.nombre.toLowerCase()
            .includes("refrigerada")
        ) {

            categoria = "3leches";

        }

        // BROWNIES
        else if (
            producto.nombre.toLowerCase()
            .includes("brownie")
        ) {

            categoria = "brownies";

        }

        // GALLETAS
        else if (
            producto.nombre.toLowerCase()
            .includes("galleta")
        ) {

            categoria = "galletas";

        }

        // CUPCAKES
        else if (
            producto.nombre.toLowerCase()
            .includes("cupcake")
        ) {

            categoria = "cupcakes";

        }

        // PERSONALIZADAS
        else if (
            producto.nombre.toLowerCase()
            .includes("personalizada")
        ) {

            categoria = "personalizada";

        }

        else {

            categoria = producto.nombre;

        }

        if (!grupos[categoria]) {

            grupos[categoria] = [];

        }

        grupos[categoria].push(producto);

    });

    let html = "";

    // ======================
    // CREAR CARDS
    // ======================
    Object.keys(grupos).forEach(categoria => {

        const items =
            grupos[categoria];

        // ==================================
        // PRODUCTOS CON OPCIONES
        // ==================================
        if (items.length > 1) {

            let imagen =
                "imagenes/default.jpg";

            // QUESILLO
            if (categoria === "quesillo") {

                imagen =
                    imagenesProductos.quesillo;

            }

            // 3 LECHES
            else if (
                categoria === "3leches"
            ) {

                imagen =
                    imagenesProductos["3leches"];

            }

            html += `

                <div class="card">

                    <img src="${imagen}"
                         alt="${categoria}">

                    <div class="contenido">

                        <h2>${items[0].nombre}</h2>

                        <p>
                            Escoge una opción
                        </p>

                        <select class="selector-producto">
            `;

            items.forEach(item => {

                html += `

                    <option
                        value="${item.nombre}"
                        data-precio="${item.precio}">

                        ${item.nombre}
                        - $${item.precio}

                    </option>

                `;

            });

            html += `

                        </select>

                        <button class="btn-comprar-opcion">

                            Comprar

                        </button>

                    </div>

                </div>

            `;

        }

        // ==================================
        // PRODUCTOS NORMALES
        // ==================================
        else {

            const producto =
                items[0];

            let imagen =
                "imagenes/default.jpg";

            // BROWNIES
            if (
                producto.nombre.toLowerCase()
                .includes("brownie")
            ) {

                imagen =
                    imagenesProductos.brownies;

            }

            // GALLETAS
            else if (
                producto.nombre.toLowerCase()
                .includes("galleta")
            ) {

                imagen =
                    imagenesProductos.galletas;

            }

            // CUPCAKES
            else if (
                producto.nombre.toLowerCase()
                .includes("cupcake")
            ) {

                imagen =
                    imagenesProductos.cupcakes;

            }

            // PERSONALIZADAS
            else if (
                producto.nombre.toLowerCase()
                .includes("personalizada")
            ) {

                imagen =
                    imagenesProductos.personalizada;

            }

            // ======================
            // COTIZAR
            // ======================
            if (

                producto.nombre.toLowerCase()
                .includes("cupcake")

                ||

                producto.nombre.toLowerCase()
                .includes("personalizada")

            ) {

                html += `

                    <div class="card">

                        <img src="${imagen}"
                             alt="${producto.nombre}">

                        <div class="contenido">

                            <h2>${producto.nombre}</h2>

                            <p>
                                ${producto.descripcion}
                            </p>

                            <div class="precio">

                                Desde $${producto.precio}

                            </div>

                            <button
                                class="btn-cotizar"
                                data-producto="${producto.nombre}">

                                Cotizar

                            </button>

                        </div>

                    </div>

                `;

            }

            // ======================
            // COMPRAR NORMAL
            // ======================
            else {

                html += `

                    <div class="card">

                        <img src="${imagen}"
                             alt="${producto.nombre}">

                        <div class="contenido">

                            <h2>${producto.nombre}</h2>

                            <p>
                                ${producto.descripcion}
                            </p>

                            <div class="precio">

                                $${producto.precio}

                            </div>

                            <button
                                class="btn-comprar"
                                data-nombre="${producto.nombre}"
                                data-precio="${producto.precio}">

                                Comprar

                            </button>

                        </div>

                    </div>

                `;

            }

        }

    });

    contenedorProductos.innerHTML = html;

    activarEventos();

}


// ==========================
// ACTIVAR EVENTOS
// ==========================
function activarEventos() {

    // ======================
    // BOTONES COMPRAR
    // ======================
    document
        .querySelectorAll(".btn-comprar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const nombre =
                        boton.dataset.nombre;

                    const precio =
                        parseInt(
                            boton.dataset.precio
                        );

                    agregarAlCarrito(
                        nombre,
                        precio
                    );

                }
            );

        });

    // ======================
    // BOTONES OPCIONES
    // ======================
    document
        .querySelectorAll(".btn-comprar-opcion")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const contenido =
                        boton.closest(".contenido");

                    const selector =
                        contenido.querySelector(
                            ".selector-producto"
                        );

                    const opcion =
                        selector.options[
                            selector.selectedIndex
                        ];

                    const nombre =
                        opcion.value;

                    const precio =
                        parseFloat(
                            opcion.dataset.precio
                        );

                    agregarAlCarrito(
                        nombre,
                        precio
                    );

                }
            );

        });

    // ======================
    // BOTONES COTIZAR
    // ======================
    document
        .querySelectorAll(".btn-cotizar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const producto =
                        boton.dataset.producto;

                    const telefono =
                        "573144016623";

                    const mensaje =
                        `Hola Valencia Cakes 🍰%0A%0A` +
                        `Quiero cotizar:%0A%0A${producto}`;

                    window.open(
                        `https://wa.me/${telefono}?text=${mensaje}`,
                        "_blank"
                    );

                }
            );

        });

}


// ==========================
// AGREGAR AL CARRITO
// ==========================
function agregarAlCarrito(
    nombre,
    precio
) {

    // VALIDACIÓN
    if (
        !nombre ||
        isNaN(precio)
    ) {

        console.log(
            "Producto inválido",
            nombre,
            precio
        );

        return;

    }

    const existente =
        carrito.find(
            item => item.nombre === nombre
        );

    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({

            nombre,
            precio,
            cantidad: 1

        });

    }

    guardarCarrito();

    actualizarCarrito();

    carritoPanel.classList.add("active");

}


// ==========================
// ACTUALIZAR CARRITO
// ==========================
function actualizarCarrito() {

    listaCarrito.innerHTML = "";

    let total = 0;

    let totalItems = 0;

    carrito.forEach((producto, index) => {

        const subtotal =
            producto.precio *
            producto.cantidad;

        total += subtotal;

        totalItems +=
            producto.cantidad;

        const div =
            document.createElement("div");

        div.classList.add("item-carrito");

        div.innerHTML = `

            <p>
                <strong>
                    ${producto.nombre}
                </strong>
            </p>

            <p>

                Cantidad:

                <button
                    onclick="cambiarCantidad(${index}, -1)">
                    -
                </button>

                ${producto.cantidad}

                <button
                    onclick="cambiarCantidad(${index}, 1)">
                    +
                </button>

            </p>

            <p>
                $${subtotal}
            </p>

            <button
                class="btn-eliminar"
                onclick="eliminarDelCarrito(${index})">

                Eliminar

            </button>

            <hr>

        `;

        listaCarrito.appendChild(div);

    });

    totalElemento.textContent = total;

    contadorCarrito.textContent = totalItems;

    guardarCarrito();

}


// ==========================
// ELIMINAR DEL CARRITO
// ==========================
function eliminarDelCarrito(index) {

    carrito.splice(index, 1);

    actualizarCarrito();

}


// ==========================
// CAMBIAR CANTIDAD
// ==========================
function cambiarCantidad(
    index,
    cambio
) {

    carrito[index].cantidad += cambio;

    if (
        carrito[index].cantidad <= 0
    ) {

        carrito.splice(index, 1);

    }

    actualizarCarrito();

}


// ==========================
// VACIAR CARRITO
// ==========================
btnVaciar.addEventListener(
    "click",
    () => {

        carrito = [];

        guardarCarrito();

        actualizarCarrito();

    }
);


// ==========================
// ABRIR CARRITO
// ==========================
btnCarrito.addEventListener(
    "click",
    () => {

        carritoPanel.classList.toggle(
            "active"
        );

    }
);


// ==========================
// CERRAR CARRITO
// ==========================
btnCerrarCarrito.addEventListener(
    "click",
    () => {

        carritoPanel.classList.remove(
            "active"
        );

    }
);


// ==========================
// CERRAR SESIÓN
// ==========================
btnCerrarSesion.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "usuario"
        );

        window.location.href =
            "login.html";

    }
);


// ==========================
// FINALIZAR COMPRA
// ==========================
async function enviarPedido() {

    const usuario =
        obtenerUsuario();

    if (!usuario) {

        alert(
            "Debes iniciar sesión para finalizar la compra"
        );

        window.location.href =
            "login.html";

        return;

    }

    if (carrito.length === 0) {

        alert(
            "El carrito está vacío"
        );

        return;

    }

    try {

        let total = 0;

        let mensaje =
            "Hola Valencia Cakes 🍰%0A%0AQuiero realizar este pedido:%0A%0A";

        carrito.forEach(item => {

            const subtotal =
                item.precio *
                item.cantidad;

            total += subtotal;

            mensaje +=
                `- ${item.nombre} x${item.cantidad} = $${subtotal}%0A`;

        });

        mensaje +=
            `%0ATotal: $${total}`;

        const resp =
            await fetch(
                "http://localhost:3330/app/pedidos/crear",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        carrito,
                        total,

                        idusuario:
                            usuario.idusuario

                    })

                }
            );

        const data =
            await resp.json();

        if (!data.ok) {

            alert(
                data.msg ||
                "Error al guardar pedido"
            );

            return;

        }

        const telefono =
            "573144016623";

        window.open(
            `https://wa.me/${telefono}?text=${mensaje}`,
            "_blank"
        );

        carrito = [];

        guardarCarrito();

        actualizarCarrito();

        carritoPanel.classList.remove(
            "active"
        );

    } catch (error) {

        console.error(error);

        alert("Error de conexión");

    }

}


// ==========================
// INICIALIZAR
// ==========================
actualizarCarrito();

obtenerProductos();