document.getElementById('invoice-date').value = new Date().toISOString().slice(0, 10);

let items = [];
const IVA_RATE = 0.15; 

function addItem() {
    const desc = document.getElementById('prod-desc').value.trim();
    const qty = parseInt(document.getElementById('prod-qty').value);
    const price = parseFloat(document.getElementById('prod-price').value);

    if (!desc || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert("Por favor, rellene los campos del producto con valores válidos.");
        return;
    }

    const item = {
        id: Date.now(),
        desc,
        qty,
        price,
        total: qty * price
    };

    items.push(item);
    updateTable();
    
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-qty').value = '1';
    document.getElementById('prod-price').value = '0.00';
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
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td class="no-print"><button class="btn-danger" style="padding: 5px 10px;" onclick="deleteItem(${item.id})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });

    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('iva').innerText = `$${iva.toFixed(2)}`;
    document.getElementById('total').innerText = `$${total.toFixed(2)}`;
}

function clearInvoice() {
    if(confirm("¿Seguro que deseas limpiar la factura?")) {
        items = [];
        updateTable();
        document.getElementById('client-name').value = '';
        document.getElementById('client-id').value = '';
    }
}
