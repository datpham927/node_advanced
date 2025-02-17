const express = require("express")
const { apiKey } = require("../auth/checkAuth")
const access = require("./access/index")
const router = express.Router()


//check apiKey
//router.use(apiKey)
//check permissions
router.use("/v1/api/shop", access)
router.use("/v1/api/product", require("./product/index"))
router.use("/v1/api/discount", require("./discount/index"))
router.use("/v1/api/cart", require("./cart/index"))
router.use("/v1/api/checkout", require("./checkout/index"))
router.use("/v1/api/inventory", require("./inventory/index"))

module.exports = router
