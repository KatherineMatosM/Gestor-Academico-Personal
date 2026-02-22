class Apunte {
  constructor(data) {
    this.id = data.id;
    this.materiaId = data.materiaId;
    this.usuarioId = data.usuarioId;
    this.titulo = data.titulo;
    this.contenido = data.contenido;
    this.createAt = data.createAt;
    this.updateAt = data.updateAt;
  }
}

module.exports = Apunte;