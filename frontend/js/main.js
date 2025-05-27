import ClienteController from './controllers/ClienteController.js';
import VentaController from './controllers/VentaController.js';

document.addEventListener('DOMContentLoaded', () => {
    new ClienteController();
    new VentaController();

    // Inicializar la vista con la pestaña de clientes activa
    toggleTabs('clientes');

    // Configurar las pestañas según el rol del usuario
    const role = sessionStorage.getItem('role');
    const nav = document.querySelector('nav ul');

    // Limpiar todas las pestañas y dejar solo Clientes y Ventas
    nav.innerHTML = `
        <li><a href="#" id="tab-clientes" class="active">Clientes</a></li>
        <li><a href="#" id="tab-ventas">Ventas</a></li>
    `;

    // Si es admin, agregar las pestañas extra
    if (role === 'admin') {
        nav.innerHTML += `
            <li><a href="#" id="tab-reportes">Reportes y Análisis</a></li>
            <li><a href="#" id="tab-administracion">Administración del Sistema</a></li>
        `;
        document.getElementById('tab-reportes').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Funcionalidad de Reportes y Análisis aún no implementada.');
        });
        document.getElementById('tab-administracion').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Funcionalidad de Administración del Sistema aún no implementada.');
        });
    }

    // Volver a asignar los eventos de las pestañas principales
    document.getElementById('tab-clientes').addEventListener('click', (e) => {
        e.preventDefault();
        toggleTabs('clientes');
    });
    document.getElementById('tab-ventas').addEventListener('click', (e) => {
        e.preventDefault();
        toggleTabs('ventas');
    });
});

function toggleTabs(tab) {
    const isClientes = tab === 'clientes';
    const isVentas = tab === 'ventas';

    const tabClientes = document.getElementById('tab-clientes');
    const tabVentas = document.getElementById('tab-ventas');
    const clienteForm = document.getElementById('cliente-form');
    const clienteList = document.getElementById('cliente-list');
    const ventaForm = document.getElementById('venta-form');
    const ventaList = document.getElementById('venta-list');

    if (tabClientes) tabClientes.classList.toggle('active', isClientes);
    if (tabVentas) tabVentas.classList.toggle('active', isVentas);

    if (clienteForm) clienteForm.style.display = isClientes ? 'block' : 'none';
    if (clienteList) clienteList.style.display = isClientes ? 'block' : 'none';

    if (ventaForm) ventaForm.style.display = isVentas ? 'block' : 'none';
    if (ventaList) ventaList.style.display = isVentas ? 'block' : 'none';
}