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
              <td>${cliente.apellido}</td>
              <td>${cliente.telefono}</td>
              <td>${cliente.email}</td>
              <td>${cliente.direccion}</td>
              <td>${cliente.distrito}</td>              <td>${cliente.sexo === 'hombre' ? 'Hombre' : cliente.sexo === 'mujer' ? 'Mujer' : 'No Determinado'}</td>
              <td>${cliente.dni}</td>
              <td>
                <button class="action-btn" data-index="${index}" data-action="edit">✏️</button>
                <button class="action-btn" data-index="${index}" data-action="delete">🗑️</button>
              </td>
          `;
          this.tbody.appendChild(row);
      });
  }
}