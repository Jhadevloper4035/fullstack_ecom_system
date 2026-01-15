const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Salt rounds configuration
const SALT_ROUNDS = 12;

// Hash password - Pure async function
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return { success: true, hash };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Compare password - Pure async function
const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return { success: true, isMatch };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate random token for email verification/password reset
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate secure random string
const generateSecureRandom = (length = 16) => {
  return crypto.randomBytes(length).toString('base64url');
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomToken,
  generateSecureRandom,
  validatePasswordStrength,
};
