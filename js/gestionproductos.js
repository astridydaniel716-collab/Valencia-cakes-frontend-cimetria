const API = 'http://localhost:3330/app/productos';

const tabla = document.getElementById('tablaProductos');

const formulario = document.getElementById('formulario');

const btnNuevo = document.getElementById('btnNuevo');

const btnCancelar = document.getElementById('btnCancelar');

const btnGuardar = document.getElementById('btnGuardar');

const tituloForm = document.getElementById('tituloForm');

const idproducto = document.getElementById('idproducto');

const codigo = document.getElementById('codigo');

const nombre = document.getElementById('nombre');

const descripcion = document.getElementById('descripcion');

const porciones = document.getElementById('porciones');

const precio = document.getElementById('precio');


// LISTAR PRODUCTOS

async function obtenerProductos(){

    try{

        const response = await fetch(`${API}/todos`);

        const data = await response.json();

         let html = '';

        data.data.forEach(producto => {

            html += `
                <tr>

                    <td>${producto.idproducto}</td>

                    <td>${producto.codigo}</td>

                    <td>${producto.nombre}</td>

                    <td>${producto.descripcion}</td>

                    <td>${producto.porciones}</td>

                    <td>$ ${producto.precio}</td>

                    <td>

                        <button 
                            class="btn-editar"
                            onclick="editarProducto(${producto.idproducto},
                            '${producto.codigo}',
                            '${producto.nombre}',
                            '${producto.descripcion}',
                            '${producto.porciones}',
                            '${producto.precio}')">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button 
                            class="btn-eliminar"
                            onclick="eliminarProducto(${producto.idproducto})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>
            `;

        });
        tabla.innerHTML = html;

    }catch(error){
        console.log(error);
    }

}

// MOSTRAR FORMULARIO

btnNuevo.addEventListener('click', () => {

    limpiarFormulario();
    formulario.classList.remove('hidden');
    tituloForm.innerText = 'Crear Producto';

});

// CANCELAR


btnCancelar.addEventListener('click', () => {
    formulario.classList.add('hidden');

});

// GUARDAR PRODUCTO

btnGuardar.addEventListener('click', async () => {

    const producto = {
        codigo: codigo.value,
        nombre: nombre.value,
        descripcion: descripcion.value,
        porciones: porciones.value,
        precio: precio.value

    };

    try{

        // CREAR
        if(idproducto.value === ''){

            await fetch(`${API}/crear`, {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify(producto)

            });

        }else{

            // EDITAR
            await fetch(`${API}/editar/${idproducto.value}`, {

                method:'PUT',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify(producto)

            });

        }

        formulario.classList.add('hidden');

        limpiarFormulario();
        obtenerProductos();

    }catch(error){
        console.log(error);
    }

});

// EDITAR

function editarProducto(id, cod, nom, desc, porc, pre){

    formulario.classList.remove('hidden');

    tituloForm.innerText = 'Editar Producto';

    idproducto.value = id;
    codigo.value = cod;
    nombre.value = nom;
    descripcion.value = desc;
    porciones.value = porc;
    precio.value = pre;

}

// ELIMINAR

async function eliminarProducto(id){

    const confirmar = confirm('¿Deseas eliminar este producto?');

    if(!confirmar) return;

    try{

        await fetch(`${API}/eliminar/${id}`, {
            method:'DELETE'
        });

        obtenerProductos();

    }catch(error){
        console.log(error);
    }

}

// LIMPIAR

function limpiarFormulario(){

    idproducto.value = '';
    codigo.value = '';
    nombre.value = '';
    descripcion.value = '';
    porciones.value = '';
    precio.value = '';

}

obtenerProductos();