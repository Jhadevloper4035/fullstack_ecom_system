const mongoose = require("mongoose");


const validatePhoneNumber = (value) => /^[\d\s\-\+\(\)]+$/.test(value);
const validateOptionalPhone = (value) => !value || validatePhoneNumber(value);
const validatePostalCode = (value) => /^[A-Z0-9\s\-]{3,10}$/i.test(value);



const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["home", "work", "billing", "shipping", "other"],
      default: "home",
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: validatePhoneNumber,
        message: "Invalid phone number format",
      },
    },

    alternatePhone: {
      type: String,
      trim: true,
      validate: {
        validator: validateOptionalPhone,
        message: "Invalid phone number format",
      },
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    addressLine2: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    landmark: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "India",
      index: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: validatePostalCode,
        message: "Invalid postal code format",
      },
      index: true,
    },

    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// INDEXES
// ============================================================================

addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ userId: 1, type: 1 });
addressSchema.index({ userId: 1, isActive: 1, isDeleted: 1 });
addressSchema.index({ userId: 1, createdAt: -1 });

// ============================================================================
// VIRTUALS
// ============================================================================

addressSchema.virtual("fullAddress").get(function () {
  const parts = [
    this.addressLine1,
    this.addressLine2,
    this.landmark,
    this.city,
    this.state,
    this.postalCode,
    this.country,
  ].filter(Boolean);

  return parts.join(", ");
});

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await this.constructor.updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
        isDefault: true,
      },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Handle soft delete timestamps
addressSchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
    this.isActive = false;
  }
  next();
});

// Validate address limit per user
addressSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({
      userId: this.userId,
      isDeleted: false,
    });
    if (count >= 10) {
      throw new Error("Maximum address limit reached (10 addresses)");
    }
  }
  next();
});

// ============================================================================
// STATIC METHODS
// ============================================================================

addressSchema.statics.getUserAddresses = async function (userId) {
  return this.find({
    userId,
    isDeleted: false,
  }).sort({ isDefault: -1, createdAt: -1 });
};

addressSchema.statics.getDefaultAddress = async function (userId) {
  return this.findOne({
    userId,
    isDefault: true,
    isDeleted: false,
    isActive: true,
  });
};

addressSchema.statics.getAddressesByType = async function (userId, type) {
  return this.find({
    userId,
    type,
    isDeleted: false,
  }).sort({ isDefault: -1, createdAt: -1 });
};

addressSchema.statics.countUserAddresses = async function (userId) {
  return this.countDocuments({
    userId,
    isDeleted: false,
  });
};

addressSchema.statics.setAsDefault = async function (addressId, userId) {
  // Remove default from all other addresses
  await this.updateMany(
    { userId, _id: { $ne: addressId } },
    { $set: { isDefault: false } }
  );

  // Set this address as default
  return this.findByIdAndUpdate(
    addressId,
    { $set: { isDefault: true, isActive: true } },
    { new: true }
  );
};

addressSchema.statics.softDelete = async function (addressId, userId) {
  const address = await this.findOne({ _id: addressId, userId });

  if (!address) {
    throw new Error("Address not found");
  }

  // If deleting default address, set another as default
  if (address.isDefault) {
    const nextAddress = await this.findOne({
      userId,
      _id: { $ne: addressId },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  address.isDeleted = true;
  address.deletedAt = new Date();
  address.isActive = false;
  address.isDefault = false;

  return address.save();
};



addressSchema.statics.hardDeleteOldAddresses = async function (daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: cutoffDate },
  });
};

// ============================================================================
// INSTANCE METHODS
// ============================================================================

addressSchema.methods.softDelete = async function () {
  return this.constructor.softDelete(this._id, this.userId);
};

addressSchema.methods.makeDefault = async function () {
  return this.constructor.setAsDefault(this._id, this.userId);
};

addressSchema.methods.getFormattedAddress = function () {
  return {
    id: this._id,
    type: this.type,
    isDefault: this.isDefault,
    fullName: this.fullName,
    phoneNumber: this.phoneNumber,
    fullAddress: this.fullAddress,
    city: this.city,
    state: this.state,
    country: this.country,
    postalCode: this.postalCode,
  };
};

// ============================================================================
// MODEL EXPORT
// ============================================================================

module.exports = mongoose.model("Address", addressSchema);