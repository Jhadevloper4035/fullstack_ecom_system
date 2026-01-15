const RefreshToken = require('../models/RefreshToken');
const VerificationToken = require('../models/VerificationToken');
const PasswordResetToken = require('../models/PasswordResetToken');
const { hashToken } = require('../utils/jwt');

// Create refresh token
const createRefreshToken = async (userId, token, tokenFamily, expiresInSeconds) => {
  try {
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    
    const refreshToken = new RefreshToken({
      userId,
      tokenHash,
      tokenFamily,
      expiresAt,
    });
    
    const savedToken = await refreshToken.save();
    
    return {
      success: true,
      tokenRecord: {
        id: savedToken._id.toString(),
        token_family: savedToken.tokenFamily,
        expires_at: savedToken.expiresAt,
        created_at: savedToken.createdAt,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find refresh token
const findRefreshToken = async (token) => {
  try {
    const tokenHash = hashToken(token);
    const tokenRecord = await RefreshToken.findOne({
      tokenHash,
      isRevoked: false,
    });
    
    if (!tokenRecord) {
      return { success: false, error: 'Token not found or revoked' };
    }
    
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      return { success: false, error: 'Token expired' };
    }
    
    return {
      success: true,
      tokenRecord: {
        id: tokenRecord._id.toString(),
        user_id: tokenRecord.userId.toString(),
        token_hash: tokenRecord.tokenHash,
        token_family: tokenRecord.tokenFamily,
        expires_at: tokenRecord.expiresAt,
        is_revoked: tokenRecord.isRevoked,
        replaced_by: tokenRecord.replacedBy,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find tokens by family
const findTokensByFamily = async (tokenFamily) => {
  try {
    const tokens = await RefreshToken.find({ tokenFamily }).sort({ createdAt: -1 });
    return { success: true, tokens };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Revoke token
const revokeToken = async (tokenId) => {
  try {
    await RefreshToken.findByIdAndUpdate(tokenId, {
      isRevoked: true,
      revokedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Revoke token family
const revokeTokenFamily = async (tokenFamily) => {
  try {
    await RefreshToken.updateMany(
      { tokenFamily, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark token replaced
const markTokenReplaced = async (oldTokenId, newTokenId) => {
  try {
    await RefreshToken.findByIdAndUpdate(oldTokenId, {
      replacedBy: newTokenId,
      isRevoked: true,
      revokedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Revoke user tokens
const revokeUserTokens = async (userId) => {
  try {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create verification token
const createVerificationToken = async (userId, token, expiresInSeconds) => {
  try {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    
    const verificationToken = new VerificationToken({
      userId,
      token,
      expiresAt,
    });
    
    const savedToken = await verificationToken.save();
    
    return {
      success: true,
      tokenRecord: {
        id: savedToken._id.toString(),
        token: savedToken.token,
        expires_at: savedToken.expiresAt,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find verification token
const findVerificationToken = async (token) => {
  try {
    const tokenRecord = await VerificationToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    
    if (!tokenRecord) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    return {
      success: true,
      tokenRecord: {
        id: tokenRecord._id.toString(),
        user_id: tokenRecord.userId.toString(),
        token: tokenRecord.token,
        expires_at: tokenRecord.expiresAt,
        used: tokenRecord.used,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark verification token used
const markVerificationTokenUsed = async (tokenId) => {
  try {
    await VerificationToken.findByIdAndUpdate(tokenId, { used: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create password reset token
const createPasswordResetToken = async (userId, token, expiresInSeconds) => {
  try {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    
    const resetToken = new PasswordResetToken({
      userId,
      token,
      expiresAt,
    });
    
    const savedToken = await resetToken.save();
    
    return {
      success: true,
      tokenRecord: {
        id: savedToken._id.toString(),
        token: savedToken.token,
        expires_at: savedToken.expiresAt,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find password reset token
const findPasswordResetToken = async (token) => {
  try {
    const tokenRecord = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    
    if (!tokenRecord) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    return {
      success: true,
      tokenRecord: {
        id: tokenRecord._id.toString(),
        user_id: tokenRecord.userId.toString(),
        token: tokenRecord.token,
        expires_at: tokenRecord.expiresAt,
        used: tokenRecord.used,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark password reset token used
const markPasswordResetTokenUsed = async (tokenId) => {
  try {
    await PasswordResetToken.findByIdAndUpdate(tokenId, { used: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  createRefreshToken,
  findRefreshToken,
  findTokensByFamily,
  revokeToken,
  revokeTokenFamily,
  markTokenReplaced,
  revokeUserTokens,
  createVerificationToken,
  findVerificationToken,
  markVerificationTokenUsed,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
};
