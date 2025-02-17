const { SuccessResponse } = require("../core/success.response")
const discountService = require("../services/discount.service")

class DiscountControllers {
    // static createProduct = async (req, res, next) => {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.createDiscountCode({
                ...req.body, shopId:  req.user._id
            })
        }).send(res)
    }

    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.updateDiscountCode({ ...req.body, discount_id })
        }).send(res)
    }

    getAllDiscountWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.getAllDiscountWithProduct({
                ...req.query, shopId: req.user._id
            })
        }).send(res)
    }
    getAllDisCountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.getAllDisCountCodeByShop({
                ...req.query, shopId: req.user._id
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.getDiscountAmount({
                ...req.body, userId: req.user._id
            })
        }).send(res)
    }
    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await discountService.cancelDiscountCode({
                ...req.body
            })
        }).send(res)
    }
}
// có thể dùng static để khỏi cần new  
module.exports = new DiscountControllers() 