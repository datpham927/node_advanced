const CheckoutServices = require("../services/checkout.service")
const { CREATED, SuccessResponse } = require("../core/success.response")
const { findByEmail } = require("../services/shop.service")

class CheckoutControllers {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "checkoutReview successfully",
            statusCode: 200,
            metadata: await CheckoutServices.checkoutReview(req.body)
        }).send(res)
    }
    
}

module.exports = new CheckoutControllers()