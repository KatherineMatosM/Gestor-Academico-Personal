const { validateEmail, validateRequired, validatePassword, validateNumber } = require('../../src/utils/validators');

describe('Validadores del Sistema', () => {
  
  describe('validateEmail', () => {
    test('Debe aceptar email válido con formato correcto', () => {
      expect(validateEmail('usuario@ejemplo.com')).toBe(true);
      expect(validateEmail('test.user@dominio.co')).toBe(true);
    });

    test('Debe rechazar email sin arroba', () => {
      expect(validateEmail('usuarioejemplo.com')).toBe(false);
    });

    test('Debe rechazar email sin dominio', () => {
      expect(validateEmail('usuario@')).toBe(false);
    });

    test('Debe rechazar email vacío', () => {
      expect(validateEmail('')).toBe(false);
    });

    test('Debe rechazar email null o undefined', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('Debe aceptar contraseña válida con 8+ caracteres', () => {
      expect(validatePassword('12345678')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
    });

    test('Debe rechazar contraseña con menos de 8 caracteres', () => {
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('abc')).toBe(false);
    });

    test('Debe rechazar contraseña vacía', () => {
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('Debe aceptar valores no vacíos', () => {
      expect(validateRequired('texto')).toBe(true);
      expect(validateRequired('123')).toBe(true);
    });

    test('Debe rechazar valores vacíos', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    test('Debe rechazar null o undefined', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateNumber', () => {
    test('Debe aceptar números válidos', () => {
      expect(validateNumber(100)).toBe(true);
      expect(validateNumber(0)).toBe(true);
      expect(validateNumber(-5)).toBe(true);
    });

    test('Debe rechazar valores no numéricos', () => {
      expect(validateNumber('abc')).toBe(false);
      expect(validateNumber(NaN)).toBe(false);
    });
  });
});