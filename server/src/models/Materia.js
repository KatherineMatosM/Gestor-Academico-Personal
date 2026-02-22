class Materia {
  constructor(data) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.nombre = data.nombre;
    this.codigo = data.codigo;
    this.creditos = data.creditos;
    this.dificultad = data.dificultad;
    this.estado = data.estado;
    this.nota = data.nota;
    this.createAt = data.createAt;
    this.updateAt = data.updateAt;
  }
}

module.exports = Materia;