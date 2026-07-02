// 1. Establecer fecha de hoy por defecto
document.getElementById('invoice-date').value = new Date().toISOString().slice(0, 10);

// 2. Catálogo de Ropa (Puedes cambiar los nombres y precios a tu gusto)
const CATALOGO_ROPA = {
    "jean-hombre": { desc: "Jeans para Hombre", precio: 35.00 },
    "jean-mujer": { desc: "Jeans para Mujer", precio: 38.00 },
    "camiseta-basic": { desc: "Camiseta Básica Oversize", precio: 15.50 },
    "chamarra-cuero": { desc: "Chamarra de Cuero", precio: 65.00 },
    "vestido-casual": { desc: "Vestido Casual de Verano", precio: 28.00 },
    "sueter-lana": { desc: "Suéter de Lana", precio: 40.00 }
};

// 3. Cargar ítems guardados previamente o iniciar vacío
let items = JSON.parse(localStorage.getItem('factura_items')) || [];
const IVA_RATE = 0.15; // 15% de IVA

// Ejecutar al cargar la página por si había datos guardados
updateTable();

// 4. Función para auto-llenar el precio cuando elijas ropa del catálogo
function cargarPrecioPrenda() {
    const selectPrenda = document.getElementById('prod-desc');
    const inputPrecio = document.getElementById('prod-price');
    
    // Si la opción seleccionada existe en el catálogo, autocompleta el precio
    if (CATALOGO_ROPA[selectPrenda.value]) {
        inputPrecio.value = CATALOGO_ROPA[selectPrenda.value].precio.toFixed(2);
    } else {
        inputPrecio.value = "0.00";
    }
}

// 5. Añadir prenda a la lista
function addItem() {
    const selectPrenda = document.getElementById('prod-desc');
    const qty = parseInt(document.getElementById('prod-qty').value);
    const price = parseFloat(document.getElementById('prod-price').value);

    // Obtener el texto visible del producto seleccionado (ej: "Jeans para Hombre")
    let desc = selectPrenda.options[selectPrenda.selectedIndex].text;

    // Si elige "Otro" o escribe manualmente
    if (selectPrenda.value === "otro") {
        const descripcionManual = prompt("Escribe la descripción de la prenda:");
        if (!descripcionManual) return;
        desc = descripcionManual;
    }

    if (selectPrenda.value === "" || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert("Por favor, seleccione una prenda y coloque cantidades válidas.");
        return;
    }

    const item = {
        id: Date.now(),
        desc: desc,
        qty: qty,
        price: price,
        total: qty * price
    };

    items.push(item);
    guardarEnAlmacenamiento();
    updateTable();
    
    // Resetear formulario de producto
    selectPrenda.value = '';
    document.getElementById('prod-qty').value = '1';
    document.getElementById('prod-price').value = '0.00';
}

// 6. Eliminar prenda
function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    guardarEnAlmacenamiento();
    updateTable();
}

// 7. Actualizar la tabla y totales en pantalla
function updateTable() {
    const tbody = document.getElementById('invoice-items');
    if (!tbody) return; // Evita errores si el HTML no ha cargado totalmente
    
    tbody.innerHTML = '';
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.total;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td class="no-print">
                <button class="btn-danger" style="padding: 5px 10px;" onclick="deleteItem(${item.id})">Eliminar</button>
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

// 8. Guardar datos de manera local (Persistencia)
function guardarEnAlmacenamiento() {
    localStorage.setItem('factura_items', JSON.stringify(items));
}

// 9. Limpiar toda la factura
function clearInvoice() {
    if(confirm("¿Seguro que deseas limpiar la factura?")) {
        items = [];
        localStorage.removeItem('factura_items');
        updateTable();
        document.getElementById('client-name').value = '';
        document.getElementById('client-id').value = '';
    }
}
