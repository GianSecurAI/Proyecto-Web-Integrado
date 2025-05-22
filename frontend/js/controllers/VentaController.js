import Venta from '../models/Venta.js';
import VentaView from '../views/VentaView.js';

export default class VentaController {
    constructor() {
        this.ventas = [];
        this.view = new VentaView();
        this.init();
    }

    init() {
        document.getElementById('form-venta').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarVenta();
        });

        document.getElementById('tbody-ventas').addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const index = e.target.dataset.index;
            if (action === 'view') {
                this.verVenta(index);
            } else if (action === 'edit') {
                this.editarVenta(index);
            } else if (action === 'delete') {
                this.eliminarVenta(index);
            }
        });
    }

    registrarVenta() {
        const fecha = document.getElementById('fecha').value;
        const cliente = document.getElementById('cliente').value;
        const productos = Array.from(document.getElementById('productos').selectedOptions).map(option => option.value);
        const monto = parseFloat(document.getElementById('monto').value);
        const metodoPago = document.getElementById('metodo-pago').value;

        const venta = new Venta(fecha, cliente, productos, monto, metodoPago);
        this.ventas.push(venta);
        this.view.renderVentas(this.ventas);

        document.getElementById('form-venta').reset();
    }

    verVenta(index) {
        const venta = this.ventas[index];
        alert(`Detalles de la venta:\n\nFecha: ${venta.fecha}\nCliente: ${venta.cliente}\nProductos: ${venta.productos.join(', ')}\nMonto: $${venta.monto.toFixed(2)}\nMétodo de Pago: ${this.view.getMetodoPagoLabel(venta.metodoPago)}`);
    }

    editarVenta(index) {
        const venta = this.ventas[index];
        document.getElementById('fecha').value = venta.fecha;
        document.getElementById('cliente').value = venta.cliente;
        const productosSelect = document.getElementById('productos');
        Array.from(productosSelect.options).forEach(option => {
            option.selected = venta.productos.includes(option.value);
        });
        document.getElementById('monto').value = venta.monto;
        document.getElementById('metodo-pago').value = venta.metodoPago;

        this.eliminarVenta(index);
    }

    eliminarVenta(index) {
        this.ventas.splice(index, 1);
        this.view.renderVentas(this.ventas);
    }
}