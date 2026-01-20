const router = require("express").Router();
const addressController = require("../controllers/addressController.js")
const { validateAddressRequiredFields, handleValidationErrors } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.post("/", authenticate, validateAddressRequiredFields, handleValidationErrors, addressController.createAddress)

router.get("/get-all", authenticate, addressController.getAllAddresses)

router.put("/:id", authenticate, addressController.updateAddress)

router.delete("/:id", authenticate, addressController.deleteAddress)



module.exports = router