const express = require("express")
const CheckoutControllers = require("../../controllers/checkout.controllers")
const { authentication } = require("../../auth/authUtils")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()


 
// kiểm tra trước khi logout
router.use(authentication)
router.post("/review", asyncHandle(CheckoutControllers.checkoutReview)) 

module.exports = router