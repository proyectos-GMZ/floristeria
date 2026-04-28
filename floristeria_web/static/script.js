let productos = {};
let ramo = [];
let total = 0;

async function cargarProductos() {
    const respuesta = await fetch("/productos");
    productos = await respuesta.json();

    const lista = document.getElementById("listaProductos");
    const select = document.getElementById("productoRamo");

    lista.innerHTML = "";
    select.innerHTML = "";

    for (let nombre in productos) {
        lista.innerHTML += `
            <div class="producto">
                <strong>${nombre}</strong> - $${productos[nombre].toFixed(2)}
            </div>
        `;

        select.innerHTML += `
            <option value="${nombre}">${nombre} - $${productos[nombre].toFixed(2)}</option>
        `;
    }
}

async function agregarProducto() {
    const nombre = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;

    if (nombre === "" || precio === "") {
        alert("Llená el nombre y el precio");
        return;
    }

    await fetch("/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            precio: precio
        })
    });

    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";

    cargarProductos();
    alert("Producto guardado");
}

async function cambiarPrecio() {
    const nombre = document.getElementById("productoCambiar").value;
    const precio = document.getElementById("nuevoPrecio").value;

    const respuesta = await fetch("/cambiar_precio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            precio: precio
        })
    });

    if (!respuesta.ok) {
        alert("Ese producto no existe");
        return;
    }

    cargarProductos();
    alert("Precio actualizado");
}

async function eliminarProducto() {
    const nombre = document.getElementById("productoEliminar").value;

    const respuesta = await fetch("/eliminar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre
        })
    });

    if (!respuesta.ok) {
        alert("Ese producto no existe");
        return;
    }

    cargarProductos();
    alert("Producto eliminado");
}

function agregarAlRamo() {
    const producto = document.getElementById("productoRamo").value;
    const cantidad = parseInt(document.getElementById("cantidadRamo").value);

    if (!producto || isNaN(cantidad) || cantidad <= 0) {
        alert("Elegí producto y cantidad válida");
        return;
    }

    const precio = productos[producto];
    const subtotal = precio * cantidad;

    ramo.push({
        producto: producto,
        cantidad: cantidad,
        precio: precio,
        subtotal: subtotal
    });

    total += subtotal;

    mostrarRamo();

    document.getElementById("cantidadRamo").value = "";
}

function mostrarRamo() {
    const detalle = document.getElementById("detalleRamo");
    detalle.innerHTML = "";

    ramo.forEach(item => {
        detalle.innerHTML += `
            <div class="item-ramo">
                ${item.cantidad} x ${item.producto} ($${item.precio.toFixed(2)}) =
                $${item.subtotal.toFixed(2)}
            </div>
        `;
    });

    document.getElementById("totalRamo").innerText = `Total: $${total.toFixed(2)}`;
}

function limpiarRamo() {
    ramo = [];
    total = 0;
    mostrarRamo();
}

cargarProductos();
