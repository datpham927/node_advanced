
"use strict"
const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPairs } = require("../auth/authUtils")
const JWT = require("jsonwebtoken")
const { BadRequestRequestError, ForbiddenError, ErrorResponse } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const asyncHandle = require("../helper/asyncHandle")
const KeyTokenModels = require("../models/KeyToken.models")



class AccessServices {
    static logoutService = async (keyStore) => {
        // xóa tất cả các key trong db
        const deleteKey = KeyTokenService.removeByIdUser(keyStore._id)
        return deleteKey
    }
    // Using static does not require using the new keyword
    static loginService = async ({ email, password }) => {
        const foundShop = await shopModel.findOne({ email }).lean()
     
        if (!foundShop) {
            throw new BadRequestRequestError("Error: Shop not exits!", 403)
        }
        // kiểm tra password
        const matchPassword = bcrypt.compare(password, foundShop.password)
        if (!matchPassword) throw new BadRequestRequestError("Authentication error", 201)
        // render 2 key để lưu vào db và đăng ký token và refresh token
        const publicKey = crypto.randomBytes(100).toString('hex')
        const privateKey = crypto.randomBytes(100).toString('hex')
        // hàm này trả về accessToken 
        const tokens = await createTokenPairs(foundShop, publicKey, privateKey)
        // thêm key vào db
        await KeyTokenService.createKeyToken({ userId: foundShop._id, refreshToken: tokens.refreshToken, privateKey, publicKey })
        // create accessToken and refreshToken and add to database
        
        return {
            user: { _id: foundShop._id, email: foundShop.email },
            tokens: tokens.accessToken //accessToken
        }
    }
    static signupService = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email })
        if (holderShop) {
            throw new BadRequestRequestError("Error: Shop already exits!", 201)
        }
        const passwordHash = await bcrypt.hash(password, 10)
        // create new shop
        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: "shop" })
        // add tokenKey to the database
        if (!newShop) {
            throw new BadRequestRequestError("Error: Error!", 403)
        }
        const publicKey = crypto.randomBytes(100).toString('hex')
        const privateKey = crypto.randomBytes(100).toString('hex')
        // tạo ra key token và lưu vào database

        // create accessToken and refreshToken
        const tokens = await createTokenPairs(newShop.toObject(), publicKey, privateKey)
        await KeyTokenService.createKeyToken({ userId: newShop._id, refreshToken: tokens.refreshToken, privateKey, publicKey })

        return {
            user: newShop,
            tokens
        }
    }

    static handleRefreshToken = async ({ user, keyStore, refreshToken }) => {
        // b1:  tìm xem refreshToken đã được sử dụng chưa
        //b2 : nếu đã sử dụng thì xóa key trong db và thông báo 
        //b3 : nếu chưa sử dụng thì tìm kiếm user trong db bằng refreshToken
        //b4 : verify refreshToken lấy được {_id, email}
        //b5 : căn cứ vào {_id, email} tìm user
        //b6 : tạo và cập nhật lại refreshToken, accesstoken 
        //     và thêm refreshToken đã sử dụng vào refreshTokensUsed
        const { _id, email } = user
        // tìm xem refreshToken đã được sử dụng chưa
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // xóa key data trong database
            await KeyTokenService.removeByIdUser(_id)
            throw new ForbiddenError("Something wrong happen! please relogin")
        }

        if (keyStore.refreshToken !== refreshToken) throw new ErrorResponse("User not registered!", 201)
        // tạo 2 key moi 
        // create accessToken and refreshToken and add to database  
        const tokens = await createTokenPairs({ _id, email }, refreshToken, keyStore.privateKey)
        // update lại key trong data
        await KeyTokenModels.findByIdAndUpdate(keyStore._id, {
            $set: {
                refreshToken: tokens.refreshToken
            },
        
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }
}

module.exports = AccessServices