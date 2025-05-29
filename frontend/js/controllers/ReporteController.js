/**
 * Controlador para Reportes y Análisis
 * 
 * Este controlador maneja la funcionalidad de reportes y análisis de datos
 * de clientes y ventas en la aplicación de Perfumería La Reyna.
 * 
 * Características:
 * - Filtrado de reportes por rango de fechas
 * - Visualización de datos de clientes y ventas
 * - Análisis estadístico de ventas (total, promedio, métodos de pago)
 * - Gráfico de ventas por día
 * - Exportación de reportes mediante impresión
 */
import ReporteView from '../views/ReporteView.js';

class ReporteController {
    constructor(clienteController, ventaController) {
        this.clienteController = clienteController;
        this.ventaController = ventaController;
        
        // Inicializar vista
        const reporteSection = document.getElementById('reporte-section');
        reporteSection.innerHTML = ReporteView.getTemplate();
        
        // Referencias DOM
        this.fechaInicialInput = document.getElementById('fecha-inicial');
        this.fechaFinalInput = document.getElementById('fecha-final');
        this.btnActualizar = document.getElementById('btn-actualizar-reporte');
        this.btnImprimir = document.getElementById('btn-imprimir-reporte');
        this.tabReporteVentas = document.getElementById('tab-reporte-ventas');
        this.reporteVentasContent = document.getElementById('reporte-ventas');
        this.tbodyReporteVentas = document.getElementById('tbody-reporte-ventas');
        
        // Inicializar fechas (último mes por defecto)
        const hoy = new Date();
        const unMesAtras = new Date(hoy);
        unMesAtras.setMonth(hoy.getMonth() - 1);
        
        this.fechaInicialInput.valueAsDate = unMesAtras;
        this.fechaFinalInput.valueAsDate = hoy;
        
        this.inicializarEventos();
        this.actualizarReportes(); // Cargar datos iniciales
    }    inicializarEventos() {
        this.btnActualizar.addEventListener('click', () => this.actualizarReportes());
        this.btnImprimir.addEventListener('click', () => this.imprimirReporte());
        
        this.tabReporteVentas.addEventListener('click', () => {
            this.mostrarTabReporte('ventas');
        });
        
        // Añadir evento para la pestaña de análisis
        document.getElementById('tab-reporte-analisis').addEventListener('click', () => {
            this.mostrarTabReporte('analisis');
        });

        // Mostrar la pestaña de ventas por defecto
        this.mostrarTabReporte('ventas');
    }
    
    mostrarTabReporte(tipo) {
        // Referencias a los elementos
        const ventasTab = this.tabReporteVentas;
        const analisisTab = document.getElementById('tab-reporte-analisis');
        const ventasContent = document.getElementById('reporte-ventas');
        const analisisContent = document.getElementById('reporte-analisis');
        
        // Quitar clase active de todas las pestañas
        ventasTab.classList.remove('active');
        analisisTab.classList.remove('active');
        
        // Ocultar todos los contenidos
        ventasContent.style.display = 'none';
        analisisContent.style.display = 'none';
        
        // Activar la pestaña seleccionada
        if (tipo === 'ventas') {
            ventasTab.classList.add('active');
            ventasContent.style.display = 'block';
        } else if (tipo === 'analisis') {
            analisisTab.classList.add('active');
            analisisContent.style.display = 'block';
            this.actualizarAnalisis();
        }
    }
    
    obtenerRangoFechas() {
        const fechaInicial = this.fechaInicialInput.value ? new Date(this.fechaInicialInput.value) : null;
        const fechaFinal = this.fechaFinalInput.value ? new Date(this.fechaFinalInput.value) : null;
        
        if (fechaInicial && fechaFinal) {
            // Asegurarse de que la fecha final incluya todo el día
            fechaFinal.setHours(23, 59, 59, 999);
        }
        
        return { fechaInicial, fechaFinal };
    }      actualizarReportes() {
        this.actualizarReporteVentas();
        this.actualizarAnalisis();
    }
      actualizarReporteVentas() {
        const { fechaInicial, fechaFinal } = this.obtenerRangoFechas();
        const ventas = this.ventaController.obtenerVentas();
        const clientes = this.clienteController.obtenerClientes();
        
        this.tbodyReporteVentas.innerHTML = '';
        
        ventas.forEach(venta => {
            const fechaVenta = new Date(venta.fecha);
            
            // Si está dentro del rango de fechas o no hay filtro
            if (!fechaInicial || !fechaFinal || 
                (fechaVenta >= fechaInicial && fechaVenta <= fechaFinal)) {
                  // Obtener cliente relacionado
                let cliente = null;
                let nombreCliente = 'Cliente no encontrado';
                let dniCliente = 'N/A';

                // Intentar obtener el cliente según el formato del ID
                if (typeof venta.clienteId === 'object') {
                    cliente = clientes.find(c => c.id === venta.clienteId.id);
                } else {
                    cliente = clientes.find(c => c.id === venta.clienteId);
                }

                // Si encontramos el cliente, obtener su información
                if (cliente) {
                    nombreCliente = `${cliente.nombre} ${cliente.apellido}`;
                    dniCliente = cliente.dni || 'N/A';
                } else if (typeof venta.clienteId === 'string' && !venta.clienteId.startsWith('cliente-')) {
                    nombreCliente = venta.clienteId;
                }
                
                this.renderizarFilaVenta(venta, nombreCliente, dniCliente);
            }
        });
    }      renderizarFilaVenta(venta, nombreCliente, dniCliente = 'N/A') {
        const row = document.createElement('tr');
        
        // Obtener información de los productos
        let productosInfo = '';
        let cantidad = 0;
        
        if (venta.productos && Array.isArray(venta.productos)) {
            venta.productos.forEach(producto => {
                // Manejar diferentes formatos de productos
                if (typeof producto === 'string') {
                    // Formato antiguo: "Nombre Producto (cantidad)"
                    productosInfo += `${producto}, `;
                    // Intentar extraer la cantidad si está en formato "Nombre (X)"
                    const match = producto.match(/\((\d+)\)$/);
                    if (match) {
                        cantidad += parseInt(match[1], 10);
                    } else {
                        cantidad += 1; // Si no podemos detectar la cantidad, asumimos 1
                    }
                } else {
                    // Formato nuevo: objeto con propiedades
                    productosInfo += `${producto.nombre} (${producto.cantidad}), `;
                    cantidad += producto.cantidad;
                }
            });
            // Eliminar última coma y espacio
            if (productosInfo) {
                productosInfo = productosInfo.slice(0, -2);
            }
        } else {
            productosInfo = 'Sin productos';
            cantidad = 0;
        }
        
        row.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${nombreCliente}</td>
            <td>${dniCliente}</td>
            <td>${productosInfo}</td>
            <td>${cantidad}</td>
            <td>$${venta.monto.toFixed(2)}</td>
            <td>${venta.metodoPago || 'N/A'}</td>
        `;
        
        this.tbodyReporteVentas.appendChild(row);
    }
    
    imprimirReporte() {
        window.print();
    }
    
    actualizarAnalisis() {
        const { fechaInicial, fechaFinal } = this.obtenerRangoFechas();
        const ventas = this.ventaController.obtenerVentas();
        
        // Filtrar ventas por el rango de fechas
        const ventasFiltradas = ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return !fechaInicial || !fechaFinal || 
                   (fechaVenta >= fechaInicial && fechaVenta <= fechaFinal);
        });
          // Calcular estadísticas básicas
        const totalVentas = ventasFiltradas.length;
        const montoTotal = ventasFiltradas.reduce((sum, venta) => sum + parseFloat(venta.monto || 0), 0);
        
        // Actualizar el resumen de ventas
        document.getElementById('analisis-total-ventas').textContent = totalVentas;
        document.getElementById('analisis-monto-total').textContent = `$${montoTotal.toFixed(2)}`;
        
        // Analizar métodos de pago
        const metodosDePago = {};
        ventasFiltradas.forEach(venta => {
            const metodo = venta.metodoPago || 'No especificado';
            metodosDePago[metodo] = (metodosDePago[metodo] || 0) + 1;
        });
        
        // Renderizar tabla de métodos de pago
        const tbodyMetodosPago = document.getElementById('tbody-metodos-pago');
        tbodyMetodosPago.innerHTML = '';
        
        for (const [metodo, cantidad] of Object.entries(metodosDePago)) {
            const porcentaje = totalVentas > 0 ? (cantidad / totalVentas * 100).toFixed(1) : 0;
            const row = document.createElement('tr');
            
            let nombreMetodo;
            switch (metodo) {
                case 'efectivo':
                    nombreMetodo = 'Efectivo';
                    break;
                case 'tarjeta-credito':
                    nombreMetodo = 'Tarjeta de Crédito';
                    break;
                case 'tarjeta-debito':
                    nombreMetodo = 'Tarjeta de Débito';
                    break;
                default:
                    nombreMetodo = metodo;
            }
            
            row.innerHTML = `
                <td>${nombreMetodo}</td>
                <td>${cantidad}</td>
                <td>${porcentaje}%</td>
            `;
              tbodyMetodosPago.appendChild(row);
        }
    }
}

export default ReporteController;
