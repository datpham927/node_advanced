const express = require("express")
const InventoryControllers = require("../../controllers/inventory.controllers")
const { authentication } = require("../../auth/authUtils")
const asyncHandle = require("../../helper/asyncHandle")
const router = express.Router()


 
// kiểm tra trước khi logout
router.use(authentication)
router.post("", asyncHandle(InventoryControllers.addStockInventory)) 

module.exports = router