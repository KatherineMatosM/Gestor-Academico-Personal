export function validateEmail(email) {
  return email && email.includes("@");
}

export function validatePassword(password) {
  return password && password.length >= 8;
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}

export function validateNumber(value, min, max) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}