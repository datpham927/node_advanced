
"use strict"

const { BadRequestRequestError } = require("../core/error.response");
const findCartById = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const discountService = require("../services/discount.service");
const { acquireLock } = require("./redis.service");

class CheckoutServices {

    /*
    {
        cartId:""
        user:"id"
        shop_order_ids:[
            {
                shopId,
                shop_discountss:[
            "shopId":"",
            "discountId":"",
            codeId:'SHOP-HHH'
                ],
                item_products:[
                    price,
                    quantity,
                    product_id
                ]
            },
             {
                shopId,
                shop_discounts:[
                    {
                        shopId,
                        "discountId",
                        codeId
                    }
                ],
                item_products:[
                    price,
                    quantity,
                ]
            }
        ]
    }
    
     
    */

    static checkoutReview = async ({ cartId, userId, shop_order_ids = [] }) => {
        // check cartId tồn tại không
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestRequestError("Cart does not exits!")
        const checkout_order = {
            totalPrice: 0, //tong tien hang
            freeShip: 0,//phi van chuyen
            totalDiscount: 0,//tong tien discount giam gia
            totalCheckout: 0,//tong thanh toan
        }
        const shop_order_id_news = []
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            //checkout product avaible
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) throw new BadRequestRequestError("order wrong!")
            // tổng tiền đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);
            // tổng tiền trước khi xử lý
            checkout_order.totalPrice = checkoutPrice
            // checkout từng sản phẩm
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tong gia tri truoc khi giam giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }
            // nếu shop_discounts tồn lại lớn hơn 0, kiểm tra có hợp lệ không

            if (shop_discounts.length > 0) {
                // giả sửu có một discount
                const { totalPrice, discount } = await discountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                    checkout_order.totalDiscount = discount
                }
            }
            // tổng thanh toán cuối dùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_id_news.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_id_news,
            checkout_order
        }

    }
    static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutServices.checkoutReview({
            cartId, userId, shop_order_ids
        })
        //check lại một lần nữa xem có vượt tồn kho không 
        // get new arr product
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log("[1]:", products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        if (acquireLock.includes(false)) {
            throw new BadRequestRequestError("mot so san pham da duoc cap nhat, vui long quay lai gio hang")
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        if(newOrder){
            // remove product in cart
        }
    }

}

module.exports = CheckoutServices




