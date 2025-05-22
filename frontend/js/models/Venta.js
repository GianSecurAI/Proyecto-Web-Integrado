export default class Venta {
  constructor(fecha, cliente, productos, monto, metodoPago) {
      this.fecha = fecha;
      this.cliente = cliente;
      this.productos = productos;
      this.monto = monto;
      this.metodoPago = metodoPago;
  }
}