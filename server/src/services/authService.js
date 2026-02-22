const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const authConfig = require('../config/auth');
const { ValidationError, UnauthorizedError } = require('../utils/errors');

class AuthService {
  async register(userData) {
    const existingUser = await authRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new ValidationError('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, authConfig.bcryptRounds);
    
    const user = await authRepository.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async login(credentials) {
    const user = await authRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    return user.toJSON();
  }

  async updateProfile(userId, userData) {
    const user = await authRepository.update(userId, userData);
    return user.toJSON();
  }

  async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;

    if (!currentPassword || !newPassword) {
      throw new ValidationError('Se requiere la contraseña actual y la nueva');
    }

    if (newPassword.length < 4) {
      throw new ValidationError('La nueva contraseña debe tener al menos 4 caracteres');
    }

    // Obtener usuario actual
    const user = await authRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptRounds);

    // Actualizar contraseña
    await authRepository.updatePassword(userId, hashedPassword);

    return {
      success: true,
      message: 'Contraseña actualizada correctamente'
    };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiration }
    );
  }
}

module.exports = new AuthService();