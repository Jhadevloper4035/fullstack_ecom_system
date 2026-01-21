const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
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
            unique: true,
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
        toJSON: { virtuals: true },      // ✅ ADD THIS
        toObject: { virtuals: true },    // ✅ ADD THIS
    }
);

// Virtual field for subcategories
categorySchema.virtual("subcategories", {
    ref: "Subcategory",
    localField: "_id",
    foreignField: "category",
    match: { isDeleted: false },
});

categorySchema.index({ slug: 1, isDeleted: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });

// Auto-generate slug from name using slugify
categorySchema.pre("save", async function (next) {
    if (this.isModified("name") && !this.slug) {
        let baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });

        // Check for duplicate slugs and append number if needed
        let slug = baseSlug;
        let counter = 1;

        while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Handle soft delete
categorySchema.pre("save", function (next) {
    if (this.isDeleted && !this.deletedAt) {
        this.deletedAt = new Date();
        this.isActive = false;
    }
    next();
});

categorySchema.statics.getAllCategories = async function (populate = false) {
    const query = this.find({ isDeleted: false }).sort({ name: 1 });

    if (populate) {
        query.populate({
            path: "subcategories",
            select: "name slug description image isActive",
            options: { sort: { name: 1 } },
        });
    }

    return query;
};

categorySchema.statics.getCategoryBySlug = async function (slug, populate = false) {
    const query = this.findOne({ slug, isDeleted: false });

    if (populate) {
        query.populate({
            path: "subcategories",
            select: "name slug description image isActive",
            options: { sort: { name: 1 } },
        });
    }

    return query;
};

categorySchema.statics.searchCategories = async function (searchTerm, populate = false) {
    const query = this.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
        ],
        isDeleted: false,
    }).sort({ name: 1 });

    if (populate) {
        query.populate({
            path: "subcategories",
            select: "name slug description image isActive",
            options: { sort: { name: 1 } },
        });
    }

    return query;
};

categorySchema.statics.softDelete = async function (categoryId) {
    const category = await this.findById(categoryId);

    if (!category) {
        throw new Error("Category not found");
    }

    category.isDeleted = true;
    category.deletedAt = new Date();
    category.isActive = false;

    return category.save();
};

categorySchema.methods.softDelete = async function () {
    return this.constructor.softDelete(this._id);
};

module.exports = mongoose.model("Category", categorySchema);