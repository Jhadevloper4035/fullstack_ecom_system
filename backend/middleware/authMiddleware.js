const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { isBlacklisted } = require('../db/redis');
const userRepo = require('../repositories/userRepository');

// Authenticate middleware - Verify access token
const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }
    
    // Check if token is blacklisted
    const blacklisted = await isBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked',
      });
    }
    
    // Verify token
    const verification = verifyToken(token, 'access');
    
    if (!verification.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
    
    // Get user from database
    const userResult = await userRepo.findUserById(verification.payload.userId);
    
    if (!userResult.success) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Check if user is active
    if (!userResult.user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
      });
    }
    
    // Attach user to request
    req.user = {
      id: userResult.user.id,
      email: userResult.user.email,
      isVerified: userResult.user.is_verified,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Optional authentication - Don't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next();
    }
    
    const blacklisted = await isBlacklisted(token);
    if (blacklisted) {
      return next();
    }
    
    const verification = verifyToken(token, 'access');
    
    if (verification.success) {
      const userResult = await userRepo.findUserById(verification.payload.userId);
      
      if (userResult.success && userResult.user.is_active) {
        req.user = {
          id: userResult.user.id,
          email: userResult.user.email,
          isVerified: userResult.user.is_verified,
        };
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

// Require verified email
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
    });
  }
  
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireVerified,
};
