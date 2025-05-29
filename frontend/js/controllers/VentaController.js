import Venta from '../models/Venta.js';
import VentaView from '../views/VentaView.js';

export default class VentaController {
    constructor() {
        this.ventas = [];
        this.productosDisponibles = [];
        this.productosSeleccionados = [];
        this.view = new VentaView();
        this.init();
        this.cargarProductos();
        this.cargarVentasEjemplo(); // Agregar ventas de ejemplo
        
        // Actualizar el selector de clientes cuando cambie a la pestaña de ventas
        document.getElementById('tab-ventas').addEventListener('click', () => {
            setTimeout(() => {
                this.verificarClientesDisponibles();
            }, 300); // Dar un pequeño tiempo para que se active la pestaña
        });
    }
    
    verificarClientesDisponibles() {
        const selectorCliente = document.getElementById('cliente');
        if (selectorCliente && selectorCliente.options.length <= 1) {
            const mensaje = 'Para hacer demos, se han cargado clientes de ejemplo automáticamente en la pestaña Clientes.';
            console.info(mensaje);
            
            // Mostrar un mensaje sutil (opcional)
            const mensajeElement = document.createElement('div');
            mensajeElement.className = 'mensaje-info';
            mensajeElement.textContent = mensaje;
            mensajeElement.style.padding = '10px';
            mensajeElement.style.marginBottom = '10px';
            mensajeElement.style.backgroundColor = '#f8f9fa';
            mensajeElement.style.borderLeft = '4px solid #6a1b9a';
            mensajeElement.style.borderRadius = '4px';
            
            const ventaForm = document.getElementById('form-venta');
            if (ventaForm) {
                ventaForm.prepend(mensajeElement);
                
                // Eliminar el mensaje después de 5 segundos
                setTimeout(() => {
                    mensajeElement.style.opacity = '0';
                    mensajeElement.style.transition = 'opacity 0.5s';
                    setTimeout(() => mensajeElement.remove(), 500);
                }, 5000);
            }
        }
    }

    init() {
        document.getElementById('form-venta').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarVenta();
        });

        // Manejador para productos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar-producto')) {
                const productoId = e.target.dataset.id;
                this.agregarProductoAlCarrito(productoId);
            }
        });

        // Búsqueda de productos
        const btnBuscar = document.getElementById('btn-buscar-producto');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', () => {
                this.buscarProductos();
            });
        }

        // Evento de búsqueda con tecla Enter
        const inputBuscar = document.getElementById('buscar-producto');
        if (inputBuscar) {
            inputBuscar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.buscarProductos();
                }
            });
        }
    }    cargarProductos() {
        // Simular productos disponibles para la demo
        this.productosDisponibles = [
            { id: 1, nombre: 'Tartarus Fragancia', precio: 45.99, imagen: 'img/perfume1.jpg' },
            { id: 2, nombre: 'Tambo & Tammy Fragancia', precio: 39.99, imagen: 'img/perfume2.jpg' },
            { id: 3, nombre: 'Tampico Fragancia', precio: 29.99, imagen: 'img/perfume3.jpg' },
            { id: 4, nombre: 'Talara & Trees Fragancia', precio: 59.99, imagen: 'img/perfume4.jpg' }
        ];
        
        // Renderizar los productos en la vista
        this.view.renderProductos(this.productosDisponibles);
        
        // Inicializar el monto a 0
        document.getElementById('total-venta').textContent = '0.00';
    }

    buscarProductos() {
        const busqueda = document.getElementById('buscar-producto').value.toLowerCase();
        
        if (busqueda.trim() === '') {
            this.view.renderProductos(this.productosDisponibles);
            return;
        }
        
        const productosFiltrados = this.productosDisponibles.filter(
            producto => producto.nombre.toLowerCase().includes(busqueda)
        );
        
        this.view.renderProductos(productosFiltrados);
    }

    agregarProductoAlCarrito(productoId) {
        const producto = this.productosDisponibles.find(p => p.id == productoId);
        
        if (producto) {
            // Verificar si el producto ya está en el carrito
            const existente = this.productosSeleccionados.find(p => p.id == productoId);
            
            if (existente) {
                existente.cantidad += 1;
            } else {
                this.productosSeleccionados.push({
                    ...producto,
                    cantidad: 1
                });
            }
            
            this.actualizarCarritoUI();
            this.calcularTotal();
        }
    }

    actualizarCarritoUI() {
        const carritoContainer = document.getElementById('carrito-productos');
        const resumenContainer = document.getElementById('productos-resumen');
        
        if (carritoContainer) {
            carritoContainer.innerHTML = '';
            
            this.productosSeleccionados.forEach(producto => {
                const itemCarrito = document.createElement('div');
                itemCarrito.className = 'item-carrito';
                itemCarrito.innerHTML = `
                    <span class="nombre-producto">${producto.nombre}</span>
                    <div class="controles-cantidad">
                        <button class="btn-menos" data-id="${producto.id}">-</button>
                        <span class="cantidad">${producto.cantidad}</span>
                        <button class="btn-mas" data-id="${producto.id}">+</button>
                    </div>
                    <span class="precio-total">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                    <button class="btn-eliminar" data-id="${producto.id}">🗑️</button>
                `;
                
                carritoContainer.appendChild(itemCarrito);
            });
            
            // Agregar eventos a los botones del carrito
            carritoContainer.querySelectorAll('.btn-menos').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.disminuirCantidad(e.target.dataset.id);
                });
            });
            
            carritoContainer.querySelectorAll('.btn-mas').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.aumentarCantidad(e.target.dataset.id);
                });
            });
            
            carritoContainer.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.eliminarDelCarrito(e.target.dataset.id);
                });
            });
        }
        
        // Actualizar también el resumen en el formulario
        if (resumenContainer) {
            resumenContainer.innerHTML = '';
            
            this.productosSeleccionados.forEach(producto => {
                const itemResumen = document.createElement('div');
                itemResumen.className = 'item-resumen';
                itemResumen.textContent = `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`;
                resumenContainer.appendChild(itemResumen);
            });
        }
    }    calcularTotal() {
        const total = this.productosSeleccionados.reduce(
            (sum, producto) => sum + (producto.precio * producto.cantidad), 0
        );
        
        document.getElementById('total-venta').textContent = total.toFixed(2);
        
        // Actualizar el campo oculto del monto
        const montoInput = document.getElementById('monto');
        if (montoInput) {
            montoInput.value = total.toFixed(2);
        }
        
        // Actualizar el campo oculto de productos
        const productosInput = document.getElementById('productos-input');
        if (productosInput) {
            const productosData = JSON.stringify(this.productosSeleccionados.map(p => ({
                id: p.id,
                nombre: p.nombre,
                cantidad: p.cantidad,
                precio: p.precio
            })));
            productosInput.value = productosData;
        }
    }

    disminuirCantidad(productoId) {
        const index = this.productosSeleccionados.findIndex(p => p.id == productoId);
        if (index !== -1) {
            if (this.productosSeleccionados[index].cantidad > 1) {
                this.productosSeleccionados[index].cantidad -= 1;
            } else {
                this.eliminarDelCarrito(productoId);
                return;
            }
            this.actualizarCarritoUI();
            this.calcularTotal();
        }
    }

    aumentarCantidad(productoId) {
        const index = this.productosSeleccionados.findIndex(p => p.id == productoId);
        if (index !== -1) {
            this.productosSeleccionados[index].cantidad += 1;
            this.actualizarCarritoUI();
            this.calcularTotal();
        }
    }

    eliminarDelCarrito(productoId) {
        this.productosSeleccionados = this.productosSeleccionados.filter(p => p.id != productoId);
        this.actualizarCarritoUI();
        this.calcularTotal();
    }    registrarVenta() {
        const fecha = document.getElementById('fecha').value;
        const clienteSelect = document.getElementById('cliente');
        const clienteId = clienteSelect.value;
        const productos = JSON.parse(document.getElementById('productos-input').value || '[]');
        const monto = parseFloat(document.getElementById('monto').value || 0);
        const metodoPago = document.getElementById('metodo-pago').value;
        
        // Verificar que haya productos seleccionados
        if (this.productosSeleccionados.length === 0) {
            alert('Debe seleccionar al menos un producto para registrar la venta.');
            return;
        }

        // Obtener los datos completos del cliente
        const clienteInfo = JSON.parse(clienteSelect.selectedOptions[0].dataset.cliente || '{}');
        
        const venta = new Venta(
            fecha,
            clienteId,
            productos,
            monto,
            metodoPago,
            {
                nombre: clienteInfo.nombre || '',
                apellido: clienteInfo.apellido || '',
                dni: clienteInfo.dni || 'N/A'
            }
        );
        this.ventas.push(venta);
        
        // Reiniciar el formulario y el carrito
        document.getElementById('form-venta').reset();
        this.productosSeleccionados = [];
        this.actualizarCarritoUI();
        this.calcularTotal();
        
        alert('Venta registrada con éxito.');
    }

    verVenta(index) {
        const venta = this.ventas[index];
        alert(`Detalles de la venta:\n\nFecha: ${venta.fecha}\nCliente: ${venta.cliente}\nProductos: ${venta.productos.join(', ')}\nMonto: $${venta.monto.toFixed(2)}\nMétodo de Pago: ${this.view.getMetodoPagoLabel(venta.metodoPago)}`);
    }

    editarVenta(index) {
        const venta = this.ventas[index];
        
        // Establecer fecha y cliente
        document.getElementById('fecha').value = venta.fecha;
        document.getElementById('cliente').value = venta.cliente;
        
        // Recrear los productos seleccionados basados en la venta
        this.productosSeleccionados = venta.productos.map(productoStr => {
            // Extraer nombre y cantidad de la cadena (ej: "Perfume (2)")
            const match = productoStr.match(/(.+) \((\d+)\)/);
            
            if (match) {
                const nombre = match[1];
                const cantidad = parseInt(match[2]);
                
                // Buscar el producto por nombre
                const producto = this.productosDisponibles.find(p => p.nombre === nombre);
                
                if (producto) {
                    return {
                        ...producto,
                        cantidad
                    };
                }
            }
            
            return null;
        }).filter(Boolean); // Eliminar posibles null
        
        // Actualizar la interfaz
        document.getElementById('monto').value = venta.monto;
        document.getElementById('metodo-pago').value = venta.metodoPago;
        
        this.actualizarCarritoUI();
        this.calcularTotal();
        
        // Activar pestaña de ventas para mostrar el formulario
        toggleTabs('ventas');
        
        // Eliminar la venta original
        this.eliminarVenta(index);
    }

    eliminarVenta(index) {
        if (confirm('¿Está seguro de eliminar esta venta?')) {
            this.ventas.splice(index, 1);
            this.view.renderVentas(this.ventas);
        }
    }
    
    obtenerVentas() {
        return this.ventas;
    }
    
    cargarVentasEjemplo() {
        if (this.ventas.length === 0) {
            // Fechas de ejemplo (últimos 30 días)
            const fechaActual = new Date();
            const fechas = [];
            
            for (let i = 30; i >= 0; i--) {
                const fecha = new Date(fechaActual);
                fecha.setDate(fechaActual.getDate() - i);
                fechas.push(fecha.toISOString().split('T')[0]);
            }
            
            // Crear ventas de ejemplo con información completa del cliente
            const venta1 = new Venta(
                fechas[5],
                'cliente-001',
                [
                    { id: 1, nombre: 'Perfume Floral', cantidad: 1, precio: 89.99 },
                    { id: 3, nombre: 'Perfume Frutal', cantidad: 2, precio: 75.50 }
                ],
                241.99,
                'efectivo',
                {
                    nombre: 'María',
                    apellido: 'González',
                    dni: '45678912'
                }
            );
            
            const venta2 = new Venta(
                fechas[10],
                'cliente-002',
                [
                    { id: 2, nombre: 'Perfume Amaderado', cantidad: 1, precio: 120.00 },
                ],
                120.00,
                'tarjeta-credito',
                {
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    dni: '76543210'
                }
            );
            
            const venta3 = new Venta(
                fechas[15],
                'cliente-001',
                [
                    { id: 4, nombre: 'Perfume Oriental', cantidad: 1, precio: 95.75 },
                ],
                95.75,
                'tarjeta-debito',
                {
                    nombre: 'María',
                    apellido: 'González',
                    dni: '45678912'
                }
            );
            
            const venta4 = new Venta(
                fechas[20],
                'cliente-002',
                [
                    { id: 1, nombre: 'Perfume Floral', cantidad: 2, precio: 89.99 },
                ],
                179.98,
                'efectivo',
                {
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    dni: '76543210'
                }
            );
            
            // Agregar las ventas a la lista
            this.ventas.push(venta1, venta2, venta3, venta4);
            
            // Actualizar la vista
            if (this.view) {
                this.view.renderVentas(this.ventas);
            }
        }
    }
}