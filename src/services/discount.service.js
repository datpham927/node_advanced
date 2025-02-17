"use strict"

const { BadRequestRequestError, NotFoundError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { findAllDiscountCodeUnselect, checkDiscountExits, findAllDiscountCodeSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils")


class discountService {

    static async createDiscountCode(payload) {
        const { name, description, type, value,
            code, start_date, end_code, users_count, max_uses,
            users_used, max_users_per_user, min_order_user, uses_count,
            shopId, is_active, applies_to, product_ids } = payload
        console.log("payload", payload)
        if (new Date() > new Date(end_code)) {
            throw new BadRequestRequestError("Code has expired!")
        }
        if (new Date(start_date) > new Date(end_code)) {
            throw new BadRequestRequestError("Start must be before end code")
        }
        const foundDiscount = await discount.find({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (!foundDiscount && !foundDiscount.discount_is_active) {
            throw new BadRequestRequestError("Discount already exists!")
        }
        const newDiscount = await discount.create({
            discount_name: name, discount_description: description,
            discount_type: type, discount_value: value,
            discount_code: code, discount_start_date: start_date,
            discount_max_uses: max_uses, discount_start_date: start_date,
            discount_end_code: end_code, discount_users_count: users_count,
            discount_users_used: users_used, discount_max_users_per_user: max_users_per_user,
            discount_min_order_user: min_order_user, discount_shopId: shopId,
            discount_is_active: is_active, discount_applies_to: applies_to,
            discount_product_ids: applies_to == "All" ? [] : product_ids,
            discount_uses_count: uses_count
        })
        return newDiscount

    }
    static async updateDiscountCode(discount_id, payload) {
        const { name, description, type, value,
            code, start_date, end_code, users_count,
            users_used, max_users_per_user, min_order_user,
            shopId, is_active, applies_to, product_ids } = payload
        return await discount.findByIdAndUpdate(discount_id, {
            discount_name: name, discount_description: description,
            discount_type: type, discount_value: value,
            discount_code: code, discount_start_date: start_date,
            discount_end_code: end_code, discount_users_count: users_count,
            discount_users_used: users_used, discount_max_users_per_user: max_users_per_user,
            discount_min_order_user: min_order_user, discount_shopId: shopId,
            discount_is_active: is_active, discount_applies_to: applies_to,
            discount_product_ids: applies_to == "All" ? [] : product_ids,
        })
    }
    // lấy tất cả product áp dụng cho code
    static async getAllDiscountWithProduct({
        code, shopId, limit, page
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (!foundDiscount && !foundDiscount.discount_is_active) {
            throw new BadRequestRequestError("Discount already exists!")
        } 
        const product = await findAllProducts({
            limit: +limit,
            sort: "ctime",
            page: +page,
            filter: { _id: { $in: foundDiscount.discount_product_ids }, isPublished: true },
            select: ["product_name"]
        }) 
        return product
    }

    // lấy tất cả discount shop đã tạo
    static async getAllDisCountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeSelect({
            model: discount,
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ["discount_name", "discount_code"]
        })
        return discounts;
    }
    // tính giảm giá
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: { discount_code: codeId, discount_shopId: convertToObjectIdMongodb(shopId) }
        })
        if (!foundDiscount) throw new NotFoundError("discount does not exits")
        const {
            discount_max_uses,
            discount_min_order_user,
            discount_users_used,
            discount_max_users_per_user,
            discount_is_active,
            discount_start_date,
            discount_end_date,
            discount_type,discount_value
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError("discount expired")
        if (!discount_max_uses) throw new NotFoundError("discount expired")

        if (new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError("discount code has expired")
        }

        let totalOrder = 0
        if (discount_min_order_user > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_user) {
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_user} `)
            }
        }
        if (discount_max_users_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId = userId)
            if (userUserDiscount) {
                throw new NotFoundError(`discount code had been used!`)
            }
        }
        const amount = discount_type == "fixed_amount" ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // khi có người trả lại discount(hủy)
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: {
                discount_shopId: shopId,
                discount_code: codeId
            }
        })
        if (!foundDiscount) throw new NotFoundError("discount does not exist")

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $in: {
                discount_max_users: 1,
                discount_uses_count: -1
            }
        })
        return result;
    }
}

module.exports = discountService;