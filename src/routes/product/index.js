const express = require("express")
const ProductControllers = require("../../controllers/product.controller")
const { authentication } = require("../../auth/authUtils")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()

router.get("/search/:keySearch", asyncHandle(ProductControllers.getListSearchProduct))
router.get("", asyncHandle(ProductControllers.getAllProduct))
router.get("/:id", asyncHandle(ProductControllers.getProduct))


// -----------------
router.use(authentication)
router.post("", asyncHandle(ProductControllers.createProduct))
router.patch("/:id", asyncHandle(ProductControllers.updateProduct))
router.put("/publish/:id", asyncHandle(ProductControllers.publishProductForShop))
router.put("/unpublish/all", asyncHandle(ProductControllers.unPublishProductForShop))

router.get("/draft/all", asyncHandle(ProductControllers.getALlDraftShop))
router.get("/publish/all", asyncHandle(ProductControllers.getALlPublishShop))

module.exports = router