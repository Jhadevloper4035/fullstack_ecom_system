// models/Subcategory.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            index: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        image: {
            type: String,
            trim: true,
        },

        // Reference to parent category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },

        // Status
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        // Soft delete
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
    }
);

// Compound indexes
subcategorySchema.index({ category: 1, isDeleted: 1 });
subcategorySchema.index({ category: 1, slug: 1 }, { unique: true });
subcategorySchema.index({ isActive: 1, isDeleted: 1 });
subcategorySchema.index({ category: 1, isActive: 1, isDeleted: 1 });

// Auto-generate slug from name using slugify
subcategorySchema.pre("save", async function (next) {
    if (this.isModified("name") || this.isNew) {
        let baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });

        // Check for duplicate slugs within the same category
        let slug = baseSlug;
        let counter = 1;

        while (
            await this.constructor.findOne({
                slug,
                category: this.category,
                _id: { $ne: this._id },
            })
        ) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Handle soft delete
subcategorySchema.pre("save", function (next) {
    if (this.isDeleted && !this.deletedAt) {
        this.deletedAt = new Date();
        this.isActive = false;
    }
    next();
});

// Static methods
subcategorySchema.statics.getAllSubcategories = async function (populateCategory = false) {
    const query = this.find({ isDeleted: false }).sort({ name: 1 });
    
    if (populateCategory) {
        query.populate({
            path: "category",
            select: "name slug image isActive",
            match: { isDeleted: false },
        });
    }
    
    return query;
};

subcategorySchema.statics.getSubcategoriesByCategory = async function (categoryId) {
    return this.find({
        category: categoryId,
        isDeleted: false,
    })
        .sort({ name: 1 })
        .populate({
            path: "category",
            select: "name slug image",
            match: { isDeleted: false },
        });
};

subcategorySchema.statics.getSubcategoryBySlug = async function (categorySlug, subcategorySlug) {
    // First find the category
    const Category = mongoose.model("Category");
    const category = await Category.findOne({ slug: categorySlug, isDeleted: false });

    if (!category) {
        return null;
    }

    return this.findOne({
        slug: subcategorySlug,
        category: category._id,
        isDeleted: false,
    }).populate({
        path: "category",
        select: "name slug image",
    });
};

subcategorySchema.statics.searchSubcategories = async function (searchTerm, categoryId = null) {
    const query = {
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
        ],
        isDeleted: false,
    };

    if (categoryId) {
        query.category = categoryId;
    }

    return this.find(query)
        .sort({ name: 1 })
        .populate({
            path: "category",
            select: "name slug image",
            match: { isDeleted: false },
        });
};

subcategorySchema.statics.softDelete = async function (subcategoryId) {
    const subcategory = await this.findById(subcategoryId);

    if (!subcategory) {
        throw new Error("Subcategory not found");
    }

    subcategory.isDeleted = true;
    subcategory.deletedAt = new Date();
    subcategory.isActive = false;

    return subcategory.save();
};

// Instance methods
subcategorySchema.methods.softDelete = async function () {
    return this.constructor.softDelete(this._id);
};

module.exports = mongoose.model("Subcategory", subcategorySchema);