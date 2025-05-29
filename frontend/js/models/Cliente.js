export default class Cliente {
  constructor(nombre, apellido, telefono, email, direccion, distrito, sexo, dni, id = null) {
      this.id = id || this.generateId();
      this.nombre = nombre;
      this.apellido = apellido;
      this.telefono = telefono;
      this.email = email;
      this.direccion = direccion;
      this.distrito = distrito;
      this.sexo = sexo;
      this.dni = dni;
      this.fechaRegistro = new Date().toISOString();
  }
  
  generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}