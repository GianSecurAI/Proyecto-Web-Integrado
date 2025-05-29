import Cliente from '../models/Cliente.js';
import ClienteView from '../views/ClienteView.js';

export default class ClienteController {
    constructor() {
        this.clientes = [];
        this.view = new ClienteView();
        this.init();
        this.cargarClientesEjemplo();
    }

    validarDatosCliente(nombre, apellido, telefono, email, dni, distrito, sexo) {
        const errores = [];
        
        // Validar nombre y apellido
        if (!nombre.trim()) {
            errores.push('El nombre es obligatorio');
        }
        if (!apellido.trim()) {
            errores.push('El apellido es obligatorio'); 
        }

        // Validar DNI (8 dígitos y único)
        if (!/^\d{8}$/.test(dni)) {
            errores.push('El DNI debe tener exactamente 8 dígitos numéricos');
        } else if (this.clientes.some(c => c.dni === dni)) {
            errores.push('Ya existe un cliente registrado con ese DNI');
        }

        // Validar teléfono (9 dígitos)
        if (!/^\d{9}$/.test(telefono)) {
            errores.push('El teléfono debe tener exactamente 9 dígitos numéricos');
        }

        // Validar email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailRegex.test(email)) {
            errores.push('El formato del email no es válido');
        }

        // Validar distrito
        if (!distrito.trim()) {
            errores.push('El distrito es obligatorio');
        }

        // Validar sexo
        if (!sexo) {
            errores.push('Debe seleccionar el sexo del cliente');
        }

        return errores;
    }    cargarClientesEjemplo() {
        // Añadir clientes de ejemplo para demos
        if (this.clientes.length === 0) {
            const fechaActual = new Date();
            
            // Crear fechas de registro escalonadas
            const fechas = [];
            for (let i = 0; i < 4; i++) {
                const fecha = new Date(fechaActual);
                fecha.setDate(fechaActual.getDate() - (15 * (i + 1)));
                fechas.push(fecha.toISOString());
            }
            
            // Cliente 1
            const cliente1 = new Cliente(
                'María', 
                'González', 
                '987654321', 
                'maria.gonzalez@example.com', 
                'Av. Los Álamos 123',
                'San Isidro',
                'mujer',
                '45678912'
            );
            cliente1.id = 'cliente-001';
            cliente1.fechaRegistro = fechas[0];
            
            // Cliente 2
            const cliente2 = new Cliente(
                'Juan', 
                'Pérez', 
                '912345678', 
                'juan.perez@example.com', 
                'Jr. Las Palmeras 456',
                'Miraflores',
                'hombre',
                '76543210'
            );
            cliente2.id = 'cliente-002';
            cliente2.fechaRegistro = fechas[1];
            
            // Cliente 3
            const cliente3 = new Cliente(
                'Ana', 
                'Martínez', 
                '945678123', 
                'ana.martinez@example.com', 
                'Calle Los Pinos 789',
                'La Molina',
                'mujer',
                '34567891'
            );
            cliente3.id = 'cliente-003';
            cliente3.fechaRegistro = fechas[2];
            
            // Cliente 4
            const cliente4 = new Cliente(
                'Carlos', 
                'Rodríguez', 
                '978123456', 
                'carlos.rodriguez@example.com', 
                'Av. El Sol 234',
                'Surco',
                'hombre',
                '23456789'
            );
            cliente4.id = 'cliente-004';
            cliente4.fechaRegistro = fechas[3];
            
            this.clientes.push(cliente1, cliente2, cliente3, cliente4);
            this.view.renderClientes(this.clientes);
            
            // Actualizar el selector de clientes en el formulario de ventas
            this.actualizarSelectorClientes();
        }
    }
      actualizarSelectorClientes() {
        const selectorCliente = document.getElementById('cliente');
        if (selectorCliente) {
            // Mantener solo la opción por defecto
            selectorCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
            
            // Agregar los clientes al selector
            this.clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                
                // Agregar los datos completos del cliente como un atributo data
                option.dataset.cliente = JSON.stringify({
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    dni: cliente.dni
                });
                
                selectorCliente.appendChild(option);
            });
        }
    }

    init() {
        // Validación en tiempo real del DNI
        document.getElementById('dni').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
            // Mostrar mensaje si el DNI ya existe
            const dni = e.target.value;
            if (dni.length === 8 && this.clientes.some(c => c.dni === dni)) {
                alert('Ya existe un cliente registrado con ese DNI');
            }
        });
        
        // Validación en tiempo real del teléfono
        document.getElementById('telefono').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
        });
        
        document.getElementById('form-cliente').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const direccion = document.getElementById('direccion').value;
            const distrito = document.getElementById('distrito').value;
            const sexo = document.getElementById('sexo').value;
            const dni = document.getElementById('dni').value;
            
            const errores = this.validarDatosCliente(nombre, apellido, telefono, email, dni, distrito, sexo);
            
            if (errores.length > 0) {
                alert('Por favor corrija los siguientes errores:\n\n' + errores.join('\n'));
                return;
            }
            
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

        // Añadir evento de búsqueda por DNI
        document.getElementById('buscar').addEventListener('input', (e) => {
            const busqueda = e.target.value.toLowerCase();
            const clientesFiltrados = this.clientes.filter(cliente => 
                cliente.dni.toLowerCase().includes(busqueda)
            );
            this.view.renderClientes(clientesFiltrados);
        });
    }    agregarCliente() {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        const distrito = document.getElementById('distrito').value;
        const sexo = document.getElementById('sexo').value;
        const dni = document.getElementById('dni').value;

        const errores = this.validarDatosCliente(nombre, apellido, telefono, email, dni, distrito, sexo);
        
        if (errores.length > 0) {
            alert('Por favor corrija los siguientes errores:\n\n' + errores.join('\n'));
            return;
        }

        const cliente = new Cliente(nombre, apellido, telefono, email, direccion, distrito, sexo, dni);
        this.clientes.push(cliente);
        this.view.renderClientes(this.clientes);
        
        // Actualizar el selector de clientes en el formulario de ventas
        this.actualizarSelectorClientes();

        // Mostrar mensaje de éxito
        alert('Cliente registrado correctamente');

        document.getElementById('form-cliente').reset();
    }    editarCliente(index) {
        const cliente = this.clientes[index];
        
        // Pre-llenar el formulario
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('apellido').value = cliente.apellido;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('email').value = cliente.email;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('distrito').value = cliente.distrito;
        document.getElementById('sexo').value = cliente.sexo;
        document.getElementById('dni').value = cliente.dni;

        // Remover el cliente actual para permitir la validación del DNI
        // (evitar el error de DNI duplicado con el mismo cliente)
        this.clientes.splice(index, 1);
          // Actualizar la vista
        this.view.renderClientes(this.clientes);
        // Actualizar el selector de clientes en el formulario de ventas
        this.actualizarSelectorClientes();
    }eliminarCliente(index) {
        if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
            this.clientes.splice(index, 1);
            this.view.renderClientes(this.clientes);
            
            // Actualizar el selector de clientes en el formulario de ventas
            this.actualizarSelectorClientes();
            
            alert('Cliente eliminado correctamente');
        }
    }
    
    obtenerClientes() {
        return this.clientes;
    }
}