class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.email = data.email;
    this.password = data.password;
    this.createAt = data.createAt;
    this.updateAt = data.updateAt;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = Usuario;