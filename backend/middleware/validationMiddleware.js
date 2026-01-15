const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Email validation
const validateEmail = () => [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
];

// Password validation
const validatePassword = () => [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

// Register validation
const validateRegister = () => [
  ...validateEmail(),
  ...validatePassword(),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Login validation
const validateLogin = () => [
  ...validateEmail(),
  ...validatePassword(),
];

// Token validation
const validateToken = () => [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),
];

// Refresh token validation
const validateRefreshToken = () => [
  body('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Refresh token is required'),
];

// Password reset validation
const validatePasswordReset = () => [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),
  ...validatePassword(),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validateRegister,
  validateLogin,
  validateToken,
  validateRefreshToken,
  validatePasswordReset,
};
