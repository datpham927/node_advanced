const express = require("express")
const CartControllers = require("../../controllers/cart.controllers")
const asyncHandle = require("../../helper/asyncHandle")
const { authentication } = require("../../auth/authUtils")
const router = express.Router()

 
// kiểm tra trước khi logout
router.use(authentication)
router.post("/", asyncHandle(CartControllers.addToCart)) 
router.post("/update", asyncHandle(CartControllers.updateProductInCart)) 
router.delete("/", asyncHandle(CartControllers.deleteProductInCart)) 
router.get("/", asyncHandle(CartControllers.getListUserCart)) 

module.exports = router