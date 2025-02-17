const InventoryServices = require("../services/inventory.service")
const { CREATED, SuccessResponse } = require("../core/success.response")
const { findByEmail } = require("../services/shop.service")

class InventoryControllers {
    addStockInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart addStockToInventory",
            statusCode: 200,
            metadata: await AccessServices.logoutService(req.keyStore)
        }).send(res)
    }
     
}

module.exports = new InventoryControllers()