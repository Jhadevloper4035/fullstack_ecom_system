const express = require('express');
const router = express.Router();
const { authenticate, authenticateAdmin } = require('../middleware/authMiddleware');

const { createSubcategory, getAllSubcategories } = require("../controllers/subcategoryController")

router.post("/", authenticate, authenticateAdmin, createSubcategory)

router.get("/", getAllSubcategories)


module.exports = router