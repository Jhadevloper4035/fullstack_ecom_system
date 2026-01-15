const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateToken,
  validateRefreshToken,
  validatePasswordReset,
  validateEmail,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');
const {
  authLimiter,
  emailLimiter,
  passwordResetLimiter,
} = require('../middleware/rateLimitMiddleware');

// Public routes
router.post(
  '/register',
  authLimiter,
  validateRegister(),
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateLogin(),
  handleValidationErrors,
  authController.login
);

router.post(
  '/verify-email',
  emailLimiter,
  validateToken(),
  handleValidationErrors,
  authController.verifyEmail
);

router.post(
  '/request-password-reset',
  passwordResetLimiter,
  validateEmail(),
  handleValidationErrors,
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  authLimiter,
  validatePasswordReset(),
  handleValidationErrors,
  authController.resetPassword
);

router.post(
  '/refresh-token',
  validateRefreshToken(),
  handleValidationErrors,
  authController.refreshToken
);

// Protected routes
router.post(
  '/logout',
  authenticate,
  authController.logout
);

router.post(
  '/logout-all',
  authenticate,
  authController.logoutAll
);

router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

module.exports = router;
