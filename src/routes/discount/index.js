const express = require("express")
const DiscountControllers = require("../../controllers/discount.controllers")
const { authentication } = require("../../auth/authUtils")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()


// -----------------
router.use(authentication)
router.post("", asyncHandle(DiscountControllers.createDiscountCode))
router.get("", asyncHandle(DiscountControllers.getAllDisCountCodeByShop))
router.get("/list_product_code", asyncHandle(DiscountControllers.getAllDiscountWithProduct))
router.get("/amount", asyncHandle(DiscountControllers.getDiscountAmount))

module.exports = router