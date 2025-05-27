import Cliente from '../models/Cliente.js';
import ClienteView from '../views/ClienteView.js';

export default class ClienteController {
    constructor() {
        this.clientes = [];
        this.view = new ClienteView();
        this.init();
        this.cargarClientesEjemplo();
    }

    cargarClientesEjemplo() {
        // Añadir dos clientes de ejemplo para demos
        if (this.clientes.length === 0) {
            // Cliente 1
            const cliente1 = new Cliente(
                'María', 
                'González', 
                '987654321', 
                'maria.gonzalez@example.com', 
                'Av. Los Álamos 123, Lima', 
                '45678912'
            );
            
            // Cliente 2
            const cliente2 = new Cliente(
                'Juan', 
                'Pérez', 
                '912345678', 
                'juan.perez@example.com', 
                'Jr. Las Palmeras 456, Lima', 
                '76543210'
            );
            
            this.clientes.push(cliente1, cliente2);
            this.view.renderClientes(this.clientes);
            
            // Actualizar el selector de clientes en el formulario de ventas
            this.actualizarSelectorClientes();
        }
    }
    
    actualizarSelectorClientes() {
        const selectorCliente = document.getElementById('cliente');
        if (selectorCliente) {
            // Mantener la opción por defecto
            selectorCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
            
            // Añadir los clientes disponibles
            this.clientes.forEach((cliente, index) => {
                const option = document.createElement('option');
                option.value = `${cliente.nombre} ${cliente.apellido}`;
                option.textContent = `${cliente.nombre} ${cliente.apellido} - ${cliente.dni}`;
                selectorCliente.appendChild(option);
            });
        }
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
    }    agregarCliente() {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        const dni = document.getElementById('dni').value;

        const cliente = new Cliente(nombre,apellido, telefono, email, direccion, dni);
        this.clientes.push(cliente);
        this.view.renderClientes(this.clientes);
        
        // Actualizar el selector de clientes en el formulario de ventas
        this.actualizarSelectorClientes();

        document.getElementById('form-cliente').reset();
    }

    editarCliente(index) {
        const cliente = this.clientes[index];
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('apellido').value = cliente.apellido;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('email').value = cliente.email;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('dni').value = cliente.dni;

        this.eliminarCliente(index);
    }    eliminarCliente(index) {
        this.clientes.splice(index, 1);
        this.view.renderClientes(this.clientes);
        
        // Actualizar el selector de clientes en el formulario de ventas
        this.actualizarSelectorClientes();
    }
}