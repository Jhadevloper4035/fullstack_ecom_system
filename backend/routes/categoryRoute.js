const express = require('express');
const router = express.Router();
const { authenticate, authenticateAdmin } = require('../middleware/authMiddleware');

const { createCategory , getAllCategories } = require("../controllers/categoryController")



router.post("/", authenticate, authenticateAdmin, createCategory)
router.get("/",  getAllCategories)

module.exports = router
