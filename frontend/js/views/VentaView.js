export default class VentaView {
  constructor() {
      this.tbody = document.getElementById('tbody-ventas');
      this.productosContainer = document.getElementById('productos-container');
  }

  renderVentas(ventas) {
      if (this.tbody) {
          this.tbody.innerHTML = '';
          ventas.forEach((venta, index) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${venta.fecha}</td>
                  <td>${venta.cliente}</td>
                  <td>$${venta.monto.toFixed(2)}</td>
                  <td>${this.getMetodoPagoLabel(venta.metodoPago)}</td>
                  <td>
                      <button class="action-btn" data-index="${index}" data-action="view">👁️</button>
                      <button class="action-btn" data-index="${index}" data-action="edit">✏️</button>
                      <button class="action-btn" data-index="${index}" data-action="delete">🗑️</button>
                  </td>
              `;
              this.tbody.appendChild(row);
          });
      }
  }
  renderProductos(productos) {
      if (this.productosContainer) {
          this.productosContainer.innerHTML = '';
          
          if (productos.length === 0) {
              this.productosContainer.innerHTML = '<div class="no-productos">No se encontraron productos</div>';
              return;
          }
          
          productos.forEach(producto => {
              const productoCard = document.createElement('div');
              productoCard.className = 'producto-card';
              productoCard.innerHTML = `
                  <div class="imagen-producto">
                      <img src="${producto.imagen || 'img/default-product.png'}" alt="${producto.nombre}" loading="lazy">
                  </div>
                  <div class="info-producto">
                      <h3>${producto.nombre}</h3>
                      <div>
                          <p>$${producto.precio.toFixed(2)}</p>
                          <button class="btn-agregar-producto" data-id="${producto.id}">Agregar</button>
                      </div>
                  </div>
              `;
              this.productosContainer.appendChild(productoCard);
          });
      }
  }

  getMetodoPagoLabel(metodoPago) {
      switch(metodoPago) {
          case 'efectivo': return 'Efectivo';
          case 'tarjeta-credito': return 'Tarjeta de Crédito';
          case 'tarjeta-debito': return 'Tarjeta de Débito';
          default: return metodoPago;
      }
  }
}