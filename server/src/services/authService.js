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
    const user = await authRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new ValidationError('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(passwordData.newPassword, authConfig.bcryptRounds);
    await authRepository.updatePassword(userId, hashedPassword);
  }

  async deleteAccount(userId) {
    await authRepository.delete(userId);
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