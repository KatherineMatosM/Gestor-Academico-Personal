class Tarea {
  constructor(data) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.materiaId = data.materiaId;
    this.titulo = data.titulo;
    this.tipo = data.tipo;
    this.fechaLimite = data.fechaLimite;
    this.prioridad = data.prioridad;
    this.estado = data.estado;
    this.createAt = data.createAt;
    this.updateAt = data.updateAt;
  }
}

module.exports = Tarea;