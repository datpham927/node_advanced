const { convertToObjectIdMongodb } = require("../../utils")
const inventory = require("../inventory.model")


const insertInventory = async ({ productId, shopId, stock, location }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: { $gte: quantity }
    }, update = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity:
                    cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }

    return await inventory.updateMany(query, update, options)
}



module.exports = { insertInventory, reservationInventory }