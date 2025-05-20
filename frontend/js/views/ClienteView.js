export default class ClienteView {
    constructor() {
        this.tbody = document.getElementById('tbody-clientes');
    }

    renderClientes(clientes) {
        this.tbody.innerHTML = '';
        clientes.forEach((cliente, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td>
                    <button class="action-btn" data-index="${index}" data-action="edit">✏️</button>
                    <button class="action-btn" data-index="${index}" data-action="delete">🗑️</button>
                </td>
            `;
            this.tbody.appendChild(row);
        });
    }
}