class Examen {
  constructor(data) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.materiaId = data.materiaId;
    this.titulo = data.titulo;
    this.fecha = data.fecha;
    this.hora = data.hora;
    this.temas = data.temas;
    this.preparacion = data.preparacion;
    this.nota = data.nota;
    this.autoevaluacion = data.autoevaluacion;
    this.createAt = data.createAt;
    this.updateAt = data.updateAt;
  }
}

module.exports = Examen;