const Category = require("../models/category.js")
const slugify = require("slugify")

/**
 * Create Category
 * POST /api/categories
 */
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        console.log(req.user)

       const slug = slugify(name, {
        lower: true,
         strict: true,
          trim: true,
});

        if (name) {
            const existingCategory = await Category.findOne({
                name,
                isDeleted: false,
            });

            if (existingCategory) {
                return res.status(400).json({
                    message: "Category with this name already exists"
                })
            }
        }

        // Create category
        const category = new Category({
            name: name.trim(),
            slug : slug,
            description: description?.trim(),
            image,
        });

        await category.save();

        return res.status(201).json({
            message: "Category  created successfully",
            category
        })


    } catch (error) {
        console.error("[Create Category Error]:", error.message);

        // Handle duplicate key error
        if (error.code === 11000) {
            return errorResponse(res, "Category with this name already exists", 400);
        }

        return res.status(500).josn({
            error,
            message: "Internal server Error"
        })
    }
};



const getAllCategories = async (req, res) => {
    try {
        const { active } = req.query

        let query = { isDeleted: false };

        // Filter by active status if provided
        if (active !== undefined) {
            query.isActive = active === "true";
        }

        const categories = await Category.find(query).sort({ name: 1 });

        return res.status(200).json({
            message: "Categories retrieved successfully",
            categories
        })

    } catch (error) {
        console.error("[Get All Categories Error]:", error.message);

        return res.status(500).josn({
            error,
            message: "Internal server Error"
        })
    }
};


/**
 * Get Category by Slug
 * GET /api/categories/slug/:slug
 */
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || slug.trim().length === 0) {
      return errorResponse(res, "Slug is required", 400);
    }

    const category = await Category.getCategoryBySlug(slug.trim());

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    return successResponse(res, category, "Category retrieved successfully");
  } catch (error) {
    console.error("[Get Category By Slug Error]:", error.message);
    return errorResponse(res, error.message, 500);
  }
};



module.exports = {createCategory , getAllCategories}