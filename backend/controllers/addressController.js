const Address = require("../models/address.js");

const createAddress = async (req, res) => {
    try {

        const userId = req.user.id

        const address = new Address({
            userId: userId,
            ...req.body
        })

        await address.save();

        return res.status(200).json({
            message: "Address created successfully",
            data: address.getFormattedAddress()
        })

    } catch (error) {

        res.status(500).json({
            error,
            message: "Internal Server error"
        })

    }

}


const getAllAddresses = async (req, res) => {
    try {

        const userId = req.user.id
        const { type } = req.query

        const addresses = type ? await Address.getAddressesByType(userId, type)
            : await Address.getUserAddresses(userId)

        const fomatedAdresses = addresses.map((add) => add.getFormattedAddress())

        return res.status(200).json({
            message: "Addresses retrieved successfully",
            fomatedAdresses
        })

    } catch (error) {

        res.status(500).json({
            error,
            message: "Internal Server error"
        })

    }

}


const getPaginatedAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [addresses, total] = await Promise.all([
      Address.find({ userId, isDeleted: false })
        .sort({ isDefault: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Address.countUserAddresses(userId),
    ]);

    const formattedAddresses = addresses.map((addr) =>
      addr.getFormattedAddress()
    );

    return successResponse(
      res,
      formattedAddresses,
      "Addresses retrieved successfully"
    ).json({
      success: true,
      message: "Addresses retrieved successfully",
      data: formattedAddresses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAddresses: total,
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[Get Paginated Addresses Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get Single Address by ID
 * GET /api/addresses/:id
 */
const getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return errorResponse(res, "Invalid address ID", 400);
    }

    const address = await Address.findOne({
      _id: id,
      userId,
      isDeleted: false,
    });

    if (!address) {
      return errorResponse(res, "Address not found", 404);
    }

    return successResponse(
      res,
      address.getFormattedAddress(),
      "Address retrieved successfully"
    );
  } catch (error) {
    console.error("[Get Address By ID Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get Default Address
 * GET /api/addresses/default
 */
const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const address = await Address.getDefaultAddress(userId);

    if (!address) {
      return errorResponse(res, "No default address found", 404);
    }

    return successResponse(
      res,
      address.getFormattedAddress(),
      "Default address retrieved successfully"
    );
  } catch (error) {
    console.error("[Get Default Address Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update Address
 * PUT /api/addresses/:id
 */
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      userId,
      isDeleted: false,
    });

    if (!address) {
      return res.status(404).json({ message : "address not found "})
    }

    // Update address fields
    const allowedFields = [
      "type",
      "fullName",
      "phoneNumber",
      "alternatePhone",
      "addressLine1",
      "addressLine2",
      "landmark",
      "city",
      "state",
      "country",
      "postalCode",
      "deliveryInstructions",
      "isDefault",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    await address.save();

    return successResponse(
      res,
      address.getFormattedAddress(),
      "Address updated successfully"
    );
  } catch (error) {
    console.error("[Update Address Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Set Address as Default
 * PATCH /api/addresses/:id/default
 */
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return errorResponse(res, "Invalid address ID", 400);
    }

    const address = await Address.setAsDefault(id, userId);

    if (!address) {
      return errorResponse(res, "Address not found", 404);
    }

    return successResponse(
      res,
      address.getFormattedAddress(),
      "Address set as default successfully"
    );
  } catch (error) {
    console.error("[Set Default Address Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Soft Delete Address
 * DELETE /api/addresses/:id
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return errorResponse(res, "Invalid address ID", 400);
    }

    await Address.softDelete(id, userId);

    return successResponse(res, null, "Address deleted successfully");
  } catch (error) {
    console.error("[Delete Address Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Restore Soft Deleted Address
 * PATCH /api/addresses/:id/restore
 */
const restoreAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return errorResponse(res, "Invalid address ID", 400);
    }

    const address = await Address.findOne({
      _id: id,
      userId,
      isDeleted: true,
    });

    if (!address) {
      return errorResponse(res, "Deleted address not found", 404);
    }

    address.isDeleted = false;
    address.deletedAt = null;
    address.isActive = true;

    await address.save();

    return successResponse(
      res,
      address.getFormattedAddress(),
      "Address restored successfully"
    );
  } catch (error) {
    console.error("[Restore Address Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get Address Statistics
 * GET /api/addresses/stats
 */
const getAddressStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, active, deleted, defaultAddress, byType] = await Promise.all([
      Address.countDocuments({ userId }),
      Address.countDocuments({ userId, isDeleted: false }),
      Address.countDocuments({ userId, isDeleted: true }),
      Address.getDefaultAddress(userId),
      Address.aggregate([
        { $match: { userId: userId, isDeleted: false } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
    ]);

    const stats = {
      total,
      active,
      deleted,
      hasDefault: !!defaultAddress,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    return successResponse(
      res,
      stats,
      "Address statistics retrieved successfully"
    );
  } catch (error) {
    console.error("[Get Address Stats Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Bulk Delete Addresses
 * POST /api/addresses/bulk-delete
 * Body: { addressIds: ["id1", "id2"] }
 */
const bulkDeleteAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressIds } = req.body;

    if (!Array.isArray(addressIds) || addressIds.length === 0) {
      return errorResponse(res, "Address IDs array is required", 400);
    }

    const validIds = addressIds.filter(validateObjectId);

    if (validIds.length === 0) {
      return errorResponse(res, "No valid address IDs provided", 400);
    }

    const deletePromises = validIds.map((id) => Address.softDelete(id, userId));
    const results = await Promise.allSettled(deletePromises);

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    return successResponse(
      res,
      { deletedCount: successCount },
      `${successCount} address(es) deleted successfully`
    );
  } catch (error) {
    console.error("[Bulk Delete Addresses Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get Addresses by Location
 * GET /api/addresses/location?city=Mumbai&state=Maharashtra&country=India
 */
const getAddressesByLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, state, country } = req.query;

    const query = { userId, isDeleted: false };

    if (city) query.city = new RegExp(city, "i");
    if (state) query.state = new RegExp(state, "i");
    if (country) query.country = new RegExp(country, "i");

    const addresses = await Address.find(query).sort({
      isDefault: -1,
      createdAt: -1,
    });

    const formattedAddresses = addresses.map((addr) =>
      addr.getFormattedAddress()
    );

    return successResponse(
      res,
      formattedAddresses,
      "Addresses retrieved successfully"
    );
  } catch (error) {
    console.error("[Get Addresses By Location Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createAddress,
  getAllAddresses,
  getPaginatedAddresses,
  getAddressById,
  getDefaultAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  restoreAddress,
  getAddressStats,
  bulkDeleteAddresses,
  getAddressesByLocation,
};
