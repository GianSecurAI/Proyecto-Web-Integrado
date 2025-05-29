export default class Venta {
  constructor(fecha, clienteId, productos, monto, metodoPago, clienteInfo = null, id = null) {
      this.id = id || this.generateId();
      this.fecha = fecha;
      this.clienteId = clienteId;
      this.productos = productos;
      this.monto = monto;
      this.metodoPago = metodoPago;
      this.clienteInfo = clienteInfo || {
          nombre: '',
          apellido: '',
          dni: 'N/A'
      };
  }
  
  generateId() {
      return 'V-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}