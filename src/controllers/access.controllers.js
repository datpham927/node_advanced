const AccessServices = require("../services/access.service")
const { CREATED, SuccessResponse } = require("../core/success.response")
const { findByEmail } = require("../services/shop.service")

class AccessControllers {
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully",
            statusCode: 200,
            metadata: await AccessServices.logoutService(req.keyStore)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login oke!",
            statusCode: 200,
            metadata: await AccessServices.loginService(req.body)
        }).send(res)
    }
    signup = async (req, res, next) => {
        new CREATED({
            message: "Registered oke!",
            metadata: await AccessServices.signupService(req.body)
        }).send(res)
    }
    refreshToken = async (req, res, next) => {
        new CREATED({
            message: "RefreshToken oke!",
            metadata: await AccessServices.handleRefreshToken({
                user: req.user,
                keyStore: req.keyStore,
                refreshToken: req.refreshToken
            })
        }).send(res)
    }
}

module.exports = new AccessControllers()