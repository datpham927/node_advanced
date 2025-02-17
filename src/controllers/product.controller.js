const { SuccessResponse } = require("../core/success.response")
const { productService } = require("../services/product.service")

class ProductControllers {
    // static createProduct = async (req, res, next) => {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Created successfully!",
            statusCode: 200,
            metadata: await productService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user._id
            })
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "updateProduct Successfully!",
            statusCode: 200,
            metadata: await productService.updateProduct(req.body.product_type, req.params.id, { product_shop: req.user._id, ...req.body })
        }).send(res)
    }
    getALlDraftShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get draft product successfully!",
            statusCode: 200,
            metadata: await productService.getAllDraftForShop({ product_shop: req.user._id })
        }).send(res)
    }
    getALlPublishShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get product public successfully!",
            statusCode: 200,
            metadata: await productService.getAllPublishForShop({ product_shop: req.user._id })
        }).send(res)
    }
    publishProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Successfully!",
            statusCode: 200,
            metadata: await productService.publicProductForShop({ product_shop: req.user._id, product_id: req.params.id })
        }).send(res)
    }
    unPublishProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Successfully!",
            statusCode: 200,
            metadata: await productService.unPublicProductForShop({ product_shop: req.user._id, product_id: req.params.id })
        }).send(res)
    }
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Successfully!",
            statusCode: 200,
            metadata: await productService.searchProductsByUser(req.params)
        }).send(res)
    }
    getAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "getAllProduct Successfully!",
            statusCode: 200,
            metadata: await productService.findAllProducts(req.params)
        }).send(res)
    }

    getProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "getProduct Successfully!",
            statusCode: 200,
            metadata: await productService.findProduct({ product_id: req.params.id, unselect: ["__v"] })
        }).send(res)
    }
}
// có thể dùng static để khỏi cần new  
module.exports = new ProductControllers()