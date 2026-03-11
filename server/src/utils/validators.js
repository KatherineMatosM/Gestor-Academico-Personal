function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return false;
  }
  return password.length >= 8;
}

function validateRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
}

function validateNumber(value) {
  if (typeof value !== 'number') {
    return false;
  }
  return !isNaN(value);
}

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
};