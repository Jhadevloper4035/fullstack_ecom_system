const userRepo = require('../repositories/userRepository');
const tokenRepo = require('../repositories/tokenRepository');
const { comparePassword, validatePasswordStrength, generateRandomToken } = require('../utils/password');
const { createTokenPair } = require('../utils/jwt');
const { addToBlacklist, isBlacklisted } = require('../db/redis');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('./emailService');

// Configuration
const getConfig = (env = process.env) => ({
  frontendUrl: env.FRONTEND_URL || 'http://localhost:3000',
  verificationTokenExpiry: 86400, // 24 hours
  resetTokenExpiry: 3600, // 1 hour
});

// Register new user
const registerUser = async (email, password) => {
  try {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        errors: passwordValidation.errors,
      };
    }

    // Create user
    const userResult = await userRepo.createUser(email, password, false);
    if (!userResult.success) {
      return userResult;
    }

    // Generate verification token
    const verificationToken = generateRandomToken();
    const config = getConfig();

    await tokenRepo.createVerificationToken(
      userResult.user.id,
      verificationToken,
      config.verificationTokenExpiry
    );

    // Send verification email
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return {
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: userResult.user.id,
        email: userResult.user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    // Find user
    const userResult = await userRepo.findUserByEmail(email);
    if (!userResult.success) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const user = userResult.user;

    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        error: 'Account is deactivated',
      };
    }

    // Verify password
    const passwordResult = await comparePassword(password, user.password_hash);
    if (!passwordResult.success || !passwordResult.isMatch) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check if email is verified
    if (!user.is_verified) {
      return {
        success: false,
        error: 'Please verify your email before logging in',
        requiresVerification: true,
      };
    }

    // Generate token pair
    const tokens = createTokenPair(user.id, user.email);

    // Store refresh token in database
    await tokenRepo.createRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.tokenFamily,
      tokens.refreshExpiresIn
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Verify email
const verifyEmail = async (token) => {
  try {
    // Find verification token
    const tokenResult = await tokenRepo.findVerificationToken(token);
    if (!tokenResult.success) {
      return tokenResult;
    }

    const tokenRecord = tokenResult.tokenRecord;

    // Verify user
    const verifyResult = await userRepo.verifyUser(tokenRecord.user_id);
    if (!verifyResult.success) {
      return verifyResult;
    }

    // Mark token as used
    await tokenRepo.markVerificationTokenUsed(tokenRecord.id);

    // Send welcome email
    await sendWelcomeEmail(verifyResult.user.email);

    return {
      success: true,
      message: 'Email verified successfully',
      user: verifyResult.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Request password reset
const requestPasswordReset = async (email) => {
  try {
    // Find user
    const userResult = await userRepo.findUserByEmail(email);
    if (!userResult.success) {
      // Don't reveal if email exists
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    const user = userResult.user;

    // Generate reset token
    const resetToken = generateRandomToken();
    const config = getConfig();

    await tokenRepo.createPasswordResetToken(
      user.id,
      resetToken,
      config.resetTokenExpiry
    );

    // Send reset email
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Reset password
const resetPassword = async (token, newPassword) => {
  try {
    // Validate new password
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        errors: passwordValidation.errors,
      };
    }

    // Find reset token
    const tokenResult = await tokenRepo.findPasswordResetToken(token);
    if (!tokenResult.success) {
      return tokenResult;
    }

    const tokenRecord = tokenResult.tokenRecord;

    // Update password
    const updateResult = await userRepo.updateUserPassword(
      tokenRecord.user_id,
      newPassword
    );

    if (!updateResult.success) {
      return updateResult;
    }

    // Mark token as used
    await tokenRepo.markPasswordResetTokenUsed(tokenRecord.id);

    // Revoke all existing refresh tokens for security
    await tokenRepo.revokeUserTokens(tokenRecord.user_id);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Refresh access token (with token rotation)
const refreshAccessToken = async (refreshToken) => {
  try {
    // Find refresh token in database
    const tokenResult = await tokenRepo.findRefreshToken(refreshToken);

    if (!tokenResult.success) {
      // Token not found or revoked - might be token reuse attack
      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }

    const tokenRecord = tokenResult.tokenRecord;

    // Check if token is blacklisted in Redis
    const blacklisted = await isBlacklisted(refreshToken);
    if (blacklisted) {
      // Revoke entire token family - security breach
      await tokenRepo.revokeTokenFamily(tokenRecord.token_family);
      return {
        success: false,
        error: 'Token has been revoked',
        securityBreach: true,
      };
    }

    // Get user
    const userResult = await userRepo.findUserById(tokenRecord.user_id);
    if (!userResult.success) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const user = userResult.user;

    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        error: 'Account is deactivated',
      };
    }

    // Generate new token pair (rotation)
    const newTokens = createTokenPair(
      user.id,
      user.email,
      tokenRecord.token_family // Keep same family
    );

    // Store new refresh token
    const newTokenResult = await tokenRepo.createRefreshToken(
      user.id,
      newTokens.refreshToken,
      newTokens.tokenFamily,
      newTokens.refreshExpiresIn
    );

    // Mark old token as replaced
    await tokenRepo.markTokenReplaced(tokenRecord.id, newTokenResult.tokenRecord.id);

    // Blacklist old refresh token
    await addToBlacklist(refreshToken, newTokens.refreshExpiresIn);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      tokens: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: newTokens.expiresIn,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Logout user
const logoutUser = async (refreshToken) => {
  try {
    // Find refresh token
    const tokenResult = await tokenRepo.findRefreshToken(refreshToken);
    if (tokenResult.success) {
      // Revoke token
      await tokenRepo.revokeToken(tokenResult.tokenRecord.id);
      // Blacklist token
      await addToBlacklist(refreshToken, 3600); // 1 hour
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Logout from all devices
const logoutAllDevices = async (userId) => {
  try {
    await tokenRepo.revokeUserTokens(userId);
    return {
      success: true,
      message: 'Logged out from all devices',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};


const userDetail = async (userId) => {
  try {

    const userDetail = await userRepo.updatedUser(userId)
    console.log(userDetail)
    return {
      success: true,
      message: 'User Details',
      user: userDetail
    };

  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  userDetail
};
