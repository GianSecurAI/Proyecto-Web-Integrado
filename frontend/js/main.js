import ClienteController from './controllers/ClienteController.js';
import VentaController from './controllers/VentaController.js';
import ReporteController from './controllers/ReporteController.js';

document.addEventListener('DOMContentLoaded', () => {
    const clienteController = new ClienteController();
    const ventaController = new VentaController();
    const reporteController = new ReporteController(clienteController, ventaController);

    // Inicializar la vista con la pestaña de clientes activa
    toggleTabs('clientes');

    // Volver a asignar los eventos de las pestañas principales
    document.getElementById('tab-clientes').addEventListener('click', (e) => {
        e.preventDefault();
        toggleTabs('clientes');
    });
    document.getElementById('tab-ventas').addEventListener('click', (e) => {
        e.preventDefault();
        toggleTabs('ventas');
    });
    document.getElementById('tab-reportes').addEventListener('click', (e) => {
        e.preventDefault();
        toggleTabs('reportes');
    });
});

function toggleTabs(tab) {
    const isClientes = tab === 'clientes';
    const isVentas = tab === 'ventas';
    const isReportes = tab === 'reportes';

    // Actualizar clases activas en las pestañas principales
    document.querySelectorAll('nav ul li a').forEach(a => {
        a.classList.remove('active');
    });

    const currentTab = document.getElementById(`tab-${tab}`);
    if (currentTab) {
        currentTab.classList.add('active');
    }

    // Ocultar todas las secciones
    const sections = ['cliente-form', 'cliente-list', 'venta-form', 'venta-list', 'reporte-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });

    // Mostrar las secciones correspondientes
    if (isClientes) {
        document.getElementById('cliente-form').style.display = 'block';
        document.getElementById('cliente-list').style.display = 'block';
    } else if (isVentas) {
        document.getElementById('venta-form').style.display = 'block';
        document.getElementById('venta-list').style.display = 'block';
    } else if (isReportes) {
        document.getElementById('reporte-section').style.display = 'block';
    }
}