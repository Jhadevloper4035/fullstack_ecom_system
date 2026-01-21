const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// JWT Configuration
const getJwtConfig = (env = process.env) => ({
  accessSecret: env.JWT_ACCESS_SECRET || 'access-secret',
  refreshSecret: env.JWT_REFRESH_SECRET || 'refresh-secret',
  accessExpiry: env.JWT_ACCESS_EXPIRY || '55m',
  refreshExpiry: env.JWT_REFRESH_EXPIRY || '7d',
});

// Parse expiry to seconds
const expiryToSeconds = (expiry) => {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1));
  
  const multipliers = {
    's': 1,
    'm': 60,
    'h': 3600,
    'd': 86400,
  };
  
  return value * (multipliers[unit] || 60);
};

// Generate Access Token - Pure function
const generateAccessToken = (config) => (payload) => {
  return jwt.sign(
    { ...payload, type: 'access' },
    config.accessSecret,
    { expiresIn: config.accessExpiry }
  );
};

// Generate Refresh Token - Pure function
const generateRefreshToken = (config) => (payload, tokenFamily) => {
  return jwt.sign(
    { ...payload, type: 'refresh', tokenFamily },
    config.refreshSecret,
    { expiresIn: config.refreshExpiry }
  );
};

// Verify Access Token - Pure function
const verifyAccessToken = (config) => (token) => {
  try {
    const decoded = jwt.verify(token, config.accessSecret);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return { success: true, payload: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verify Refresh Token - Pure function
const verifyRefreshToken = (config) => (token) => {
  try {
    const decoded = jwt.verify(token, config.refreshSecret);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return { success: true, payload: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Hash token for storage
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate token family ID
const generateTokenFamily = () => uuidv4();

// Create token pair with family
const createTokenPair = (userId, email, tokenFamily = null) => {
  const config = getJwtConfig();
  const family = tokenFamily || generateTokenFamily();
  
  const payload = { userId, email };
  
  const accessToken = generateAccessToken(config)(payload);
  const refreshToken = generateRefreshToken(config)(payload, family);
  
  return {
    accessToken,
    refreshToken,
    tokenFamily: family,
    expiresIn: expiryToSeconds(config.accessExpiry),
    refreshExpiresIn: expiryToSeconds(config.refreshExpiry),
  };
};

// Verify token wrapper
const verifyToken = (token, type = 'access') => {
  const config = getJwtConfig();
  const verifier = type === 'access' 
    ? verifyAccessToken(config) 
    : verifyRefreshToken(config);
  
  return verifier(token);
};

// Decode without verification (for inspecting expired tokens)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

module.exports = {
  createTokenPair,
  verifyToken,
  decodeToken,
  hashToken,
  generateTokenFamily,
  extractTokenFromHeader,
  expiryToSeconds,
};
