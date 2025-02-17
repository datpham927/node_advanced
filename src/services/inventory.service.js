"use strict"

const { BadRequestRequestError } = require("../core/error.response")
const inventoryModel = require("../models/inventory.model")
const { findProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory({
        stock, productId, shopId, location = "Đã Nẵng"
    }) {
        const product = await findProductById(productId)
        if (!product) throw new BadRequestRequestError("The product does not exists!")
        const query = {
            inven_shopId: shopId,
            inven_productId: productId
        }, updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = { upsert: true, new: true }
        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }
}