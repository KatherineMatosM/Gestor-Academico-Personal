const { formatDate, formatDateTime, sanitizeInput } = require('../../src/utils/helpers');

describe('Funciones Helper', () => {
  
  describe('formatDate', () => {
    test('Debe formatear fecha correctamente', () => {
      const fecha = '2026-02-15';
      const resultado = formatDate(fecha);
      expect(resultado).toBe('2026-02-15');
    });

    test('Debe retornar null para fecha inválida', () => {
      expect(formatDate(null)).toBe(null);
      expect(formatDate(undefined)).toBe(null);
    });
  });

  describe('sanitizeInput', () => {
    test('Debe eliminar espacios en blanco al inicio y final', () => {
      expect(sanitizeInput('  texto  ')).toBe('texto');
      expect(sanitizeInput('palabra   ')).toBe('palabra');
    });

    test('Debe retornar string vacío para entrada vacía', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });

    test('Debe manejar valores no-string', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
    });
  });
});