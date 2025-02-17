const CartServices = require("../services/cart.service")
const { SuccessResponse } = require("../core/success.response")

class CartControllers {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "addToCart successfully",
            statusCode: 200,
            metadata: await CartServices.addToCart({ userId: req.user._id, ...req.body })
        }).send(res)
    }
    updateProductInCart = async (req, res, next) => {
        new SuccessResponse({
            message: "updateCart successfully",
            statusCode: 200,
            metadata: await CartServices.addToCartV2({ userId: req.user._id, ...req.body })
        }).send(res)
    }
    deleteProductInCart = async (req, res, next) => {
        new SuccessResponse({
            message: "updateCart successfully",
            statusCode: 200,
            metadata: await CartServices.delete({ userId: req.user._id, ...req.body })
        }).send(res)
    }
    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: "updateCart successfully",
            statusCode: 200,
            metadata: await CartServices.getListUserCart({ userId: req.user._id })
        }).send(res)
    }

}

module.exports = new CartControllers()