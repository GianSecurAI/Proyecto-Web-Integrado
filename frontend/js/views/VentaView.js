export default class VentaView {
    constructor() {
        this.tbody = document.getElementById('tbody-ventas');
    }

    renderVentas(ventas) {
        this.tbody.innerHTML = '';
        ventas.forEach((venta, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.fecha}</td>
                <td>${venta.cliente}</td>
                <td>$${venta.monto.toFixed(2)}</td>
                <td>${this.getMetodoPagoLabel(venta.metodoPago)}</td>
                <td>
                    <button class="action-btn" data-index="${index}" data-action="view">👁️</button>
                    <button class="action-btn" data-index="${index}" data-action="edit">✏️</button>
                    <button class="action-btn" data-index="${index}" data-action="delete">🗑️</button>
                </td>
            `;
            this.tbody.appendChild(row);
        });
    }

    getMetodoPagoLabel(metodo) {
        switch (metodo) {
            case 'efectivo':
                return 'Efectivo';
            case 'tarjeta-credito':
                return 'Tarjeta de Crédito';
            case 'tarjeta-debito':
                return 'Tarjeta de Débito';
            default:
                return 'Desconocido';
        }
    }
}
