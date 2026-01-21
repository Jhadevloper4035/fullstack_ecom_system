const authService = require('../services/authService');

// Register controller
const register = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    const result = await authService.registerUser(email, password);
    
    if (!result.success) {
      console.log('Registration failed:', result.error);
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.loginUser(email, password);
    
    if (!result.success) {
      console.log(result)
      return res.status(401).json(result);
    }
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.status(200).json({
      success: true,
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Verify email controller
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    const result = await authService.verifyEmail(token);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Request password reset controller
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await authService.requestPasswordReset(email);
    
    // Always return success to prevent email enumeration
    return res.status(200).json(result);
  } catch (error) {
    console.error('Request password reset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const result = await authService.resetPassword(token, password);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Refresh token controller
const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }
    
    const result = await authService.refreshAccessToken(refreshToken);
    
    if (!result.success) {
      // Clear cookie if token is invalid
      res.clearCookie('refreshToken');
      return res.status(401).json(result);
    }
    
    // Update refresh token cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.status(200).json({
      success: true,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresIn,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Logout controller
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Logout all devices controller
const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await authService.logoutAllDevices(userId);
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Logout all error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


// Get current user controller
const getCurrentUser = async (req, res) => {
  try {

 const userDetail = await authService.userDetail(req.user.id)
    return res.status(200).json({
      success: true,
      user: userDetail,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};



module.exports = {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout,
  logoutAll,
  getCurrentUser,
};
