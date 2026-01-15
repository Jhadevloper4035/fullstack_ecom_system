const User = require('../models/User');
const { hashPassword } = require('../utils/password');

// Create user
const createUser = async (email, password, isVerified = false) => {
  try {
    const hashResult = await hashPassword(password);
    if (!hashResult.success) {
      throw new Error('Failed to hash password');
    }
    
    const user = new User({
      email: email.toLowerCase(),
      passwordHash: hashResult.hash,
      isVerified,
    });
    
    const savedUser = await user.save();
    
    return {
      success: true,
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        isVerified: savedUser.isVerified,
        createdAt: savedUser.createdAt,
      },
    };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, error: 'Email already exists' };
    }
    return { success: false, error: error.message };
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        password_hash: user.passwordHash,
        is_verified: user.isVerified,
        is_active: user.isActive,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Find user by ID
const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        is_verified: user.isVerified,
        is_active: user.isActive,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verify user
const verifyUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user password
const updateUserPassword = async (userId, newPassword) => {
  try {
    const hashResult = await hashPassword(newPassword);
    if (!hashResult.success) {
      throw new Error('Failed to hash password');
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { passwordHash: hashResult.hash },
      { new: true }
    );
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user status
const updateUserStatus = async (userId, isActive) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyUser,
  updateUserPassword,
  updateUserStatus,
};
