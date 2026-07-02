// Catálogo interno con los precios correspondientes a tu menú desplegable
const CATALOGO_PRECIOS = {
    "Camiseta Básica": 15.00,
    "Camiseta Polo": 22.50,
    "Jean Slim": 35.00,
    "Jean Clásico": 32.00,
    "Vestido Casual": 28.00,
    "Vestido Elegante": 55.00,
    "Chaqueta Denim": 45.00,
    "Chaqueta Cuero": 75.00,
    "Blusa Manga Larga": 18.50,
    "Blusa Casual": 16.00,
    "Short Deportivo": 12.50,
    "Zapatos Deportivos": 60.00,
    "Zapatos Casuales": 48.00,
    "Bolso Casual": 25.00,
    "Cinturón": 10.00,
    "Gorra": 12.00
};

let items = [];
const IVA_RATE = 0.15; 

// Inicializaciones cuando la página carga por completo
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('invoice-date').value = new Date().toISOString().slice(0, 10);
    
    let numFactura = localStorage.getItem('siguiente_factura_num') || 1;
    document.getElementById('factura').value = `FAC-${String(numFactura).padStart(4, '0')}`;
});

// Coloca el precio de forma automática según la prenda seleccionada
function cargarPrecioProducto() {
    const productoSeleccionado = document.getElementById('prod-desc').value;
    const inputPrecio = document.getElementById('prod-price');

    if (CATALOGO_PRECIOS[productoSeleccionado]) {
        inputPrecio.value = CATALOGO_PRECIOS[productoSeleccionado].toFixed(2);
    } else {
        inputPrecio.value = '';
    }
}

function addItem() {
    const categoria = document.getElementById('categoria').value;
    const desc = document.getElementById('prod-desc').value;
    const qty = parseInt(document.getElementById('prod-qty').value);
    const price = parseFloat(document.getElementById('prod-price').value);

    if (!categoria || !desc || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert("Por favor, complete todos los campos del producto con valores válidos.");
        return;
    }

    const item = {
        id: Date.now(),
        categoria,
        desc,
        qty,
        price,
        total: qty * price
    };

    items.push(item);
    updateTable();

    // Resetear formulario de productos
    document.getElementById('categoria').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-qty').value = '1';
    document.getElementById('prod-price').value = '';
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    updateTable();
}

function updateTable() {
    const tbody = document.getElementById('invoice-items');
    tbody.innerHTML = '';
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.total;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.categoria}</td>
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td class="no-print">
                <button class="btn-danger" style="padding: 5px 10px; margin: 0;" onclick="deleteItem(${item.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('iva').innerText = `$${iva.toFixed(2)}`;
    document.getElementById('total').innerText = `$${total.toFixed(2)}`;
}

function guardarFactura() {
    if (items.length === 0) {
        alert("No hay productos en la factura para guardar.");
        return;
    }

    const cliente = document.getElementById('client-name').value.trim();
    if (!cliente) {
        alert("Por favor ingrese el nombre del cliente.");
        return;
    }

    alert(`Factura ${document.getElementById('factura').value} guardada con éxito.`);
    
    let numFactura = parseInt(localStorage.getItem('siguiente_factura_num') || 1);
    localStorage.setItem('siguiente_factura_num', numFactura + 1);

    clearInvoice(false); 
}

function clearInvoice(confirmacion = true) {
    if (confirmacion && !confirm("¿Seguro que deseas vaciar y crear una nueva factura?")) {
        return;
    }

    items = [];
    updateTable();

    document.getElementById('client-name').value = '';
    document.getElementById('client-id').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('direccion').value = '';
    
    let numFactura = localStorage.getItem('siguiente_factura_num') || 1;
    document.getElementById('factura').value = `FAC-${String(numFactura).padStart(4, '0')}`;
}
