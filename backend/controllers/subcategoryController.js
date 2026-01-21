
const Subcategory = require("../models/subcategory");
const Category = require("../models/category");
const slugify = require("slugify")


// @desc    Create new subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubcategory = async (req, res) => {
    try {
        const { name, description, image, category, isActive } = req.body;

        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true,
        })

        const categoryExists = await Category.findOne({
            _id: category,
            isDeleted: false,
        });

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Check if subcategory with same name exists in the same category
        const existingSubcategory = await Subcategory.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            category,
            isDeleted: false,
        });

        if (existingSubcategory) {
            return res.status(400).json({
                success: false,
                message: "Subcategory with this name already exists in this category",
            });
        }

        const subcategory = await Subcategory.create({
            name,
            slug,
            description,
            image,
            category,
            isActive,
        });

        // Populate category details
        await subcategory.populate({
            path: "category",
            select: "name slug image",
        });

        res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: subcategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating subcategory",
            error: error.message,
        });
    }
};


// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
const getAllSubcategories = async (req, res) => {
    try {
        const { search, categoryId, isActive, populate } = req.query;

        let query = { isDeleted: false };

        // Filter by category if provided
        if (categoryId) {
            query.category = categoryId;
        }

        // Filter by active status if provided
        if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        let subcategoriesQuery = Subcategory.find(query).sort({ name: 1 });

        // Populate category if requested
        if (populate === "true") {
            subcategoriesQuery = subcategoriesQuery.populate({
                path: "category",
                select: "name slug image isActive",
                match: { isDeleted: false },
            });
        }

        const subcategories = await subcategoriesQuery;

        res.status(200).json({
            success: true,
            count: subcategories.length,
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching subcategories",
            error: error.message,
        });
    }
};

// @desc    Get subcategories by category slug
// @route   GET /api/categories/:categorySlug/subcategories
// @access  Public
const getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        const { isActive } = req.query;

        // Find category by slug
        const category = await Category.findOne({ slug: categorySlug, isDeleted: false });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        let query = {
            category: category._id,
            isDeleted: false,
        };

        if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }

        const subcategories = await Subcategory.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: subcategories.length,
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug,
            },
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching subcategories",
            error: error.message,
        });
    }
};

// @desc    Get subcategory by slug
// @route   GET /api/categories/:categorySlug/subcategories/:subcategorySlug
// @access  Public
const getSubcategoryBySlug = async (req, res) => {
    try {
        const { categorySlug, subcategorySlug } = req.params;

        const subcategory = await Subcategory.getSubcategoryBySlug(categorySlug, subcategorySlug);

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        res.status(200).json({
            success: true,
            data: subcategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching subcategory",
            error: error.message,
        });
    }
};



// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, category, isActive } = req.body;

        const subcategory = await Subcategory.findOne({ _id: id, isDeleted: false });

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        // If category is being changed, verify it exists
        if (category && category !== subcategory.category.toString()) {
            const categoryExists = await Category.findOne({
                _id: category,
                isDeleted: false,
            });

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            subcategory.category = category;
        }

        // Check if new name conflicts with existing subcategory in the same category
        if (name && name !== subcategory.name) {
            const existingSubcategory = await Subcategory.findOne({
                name: { $regex: new RegExp(`^${name}$`, "i") },
                category: subcategory.category,
                isDeleted: false,
                _id: { $ne: id },
            });

            if (existingSubcategory) {
                return res.status(400).json({
                    success: false,
                    message: "Subcategory with this name already exists in this category",
                });
            }

            subcategory.name = name;
        }

        if (description !== undefined) subcategory.description = description;
        if (image !== undefined) subcategory.image = image;
        if (isActive !== undefined) subcategory.isActive = isActive;

        await subcategory.save();

        // Populate category details
        await subcategory.populate({
            path: "category",
            select: "name slug image",
        });

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: subcategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating subcategory",
            error: error.message,
        });
    }
};

// @desc    Soft delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;

        const subcategory = await Subcategory.findOne({ _id: id, isDeleted: false });

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        await subcategory.softDelete();

        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting subcategory",
            error: error.message,
        });
    }
};

// @desc    Bulk update subcategories (change category)
// @route   PATCH /api/subcategories/bulk/move
// @access  Private/Admin
const bulkMoveSubcategories = async (req, res) => {
    try {
        const { subcategoryIds, newCategoryId } = req.body;

        if (!subcategoryIds || !Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Subcategory IDs array is required",
            });
        }

        if (!newCategoryId) {
            return res.status(400).json({
                success: false,
                message: "New category ID is required",
            });
        }

        // Verify new category exists
        const newCategory = await Category.findOne({
            _id: newCategoryId,
            isDeleted: false,
        });

        if (!newCategory) {
            return res.status(404).json({
                success: false,
                message: "New category not found",
            });
        }

        // Update all subcategories
        const result = await Subcategory.updateMany(
            {
                _id: { $in: subcategoryIds },
                isDeleted: false,
            },
            {
                $set: { category: newCategoryId },
            }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} subcategories moved successfully`,
            data: {
                modifiedCount: result.modifiedCount,
                newCategory: {
                    _id: newCategory._id,
                    name: newCategory.name,
                    slug: newCategory.slug,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error moving subcategories",
            error: error.message,
        });
    }
};


module.exports = { createSubcategory, getAllSubcategories }