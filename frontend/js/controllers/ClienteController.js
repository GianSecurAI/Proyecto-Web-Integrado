import Cliente from '../models/Cliente.js';
import ClienteView from '../views/ClienteView.js';

export default class ClienteController {
    constructor() {
        this.clientes = [];
        this.view = new ClienteView();
        this.init();
    }

    init() {
        document.getElementById('form-cliente').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarCliente();
        });

        document.getElementById('tbody-clientes').addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const index = e.target.dataset.index;
            if (action === 'edit') {
                this.editarCliente(index);
            } else if (action === 'delete') {
                this.eliminarCliente(index);
            }
        });
    }

    agregarCliente() {
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;

        const cliente = new Cliente(nombre, telefono, email, direccion);
        this.clientes.push(cliente);
        this.view.renderClientes(this.clientes);

        document.getElementById('form-cliente').reset();
    }

    editarCliente(index) {
        const cliente = this.clientes[index];
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('email').value = cliente.email;
        document.getElementById('direccion').value = cliente.direccion;

        this.eliminarCliente(index);
    }

    eliminarCliente(index) {
        this.clientes.splice(index, 1);
        this.view.renderClientes(this.clientes);
    }
}