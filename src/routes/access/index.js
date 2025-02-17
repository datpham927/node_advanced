const express = require("express")
const AccessControllers = require("../../controllers/access.controllers")
const { authentication } = require("../../auth/authUtils")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()


router.post("/signup", asyncHandle(AccessControllers.signup)) 
router.post("/login", asyncHandle(AccessControllers.login)) 

// kiểm tra trước khi logout
router.use(authentication)
router.post("/shop/logout", asyncHandle(AccessControllers.logout)) 
router.post("/shop/refreshToken", asyncHandle(AccessControllers.refreshToken)) 

module.exports = router