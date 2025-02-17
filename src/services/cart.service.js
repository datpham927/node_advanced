const { NotFoundError } = require("../core/error.response")
const Cart = require("../models/cart.model")
const { findProductById } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")

class CartService {
    // create or update
    static async createUserCart(userId, product) {
        const query = { cart_userId: convertToObjectIdMongodb(userId), cart_status: 'active' }
        // lấy ra price name sản phẩm
        const foundProduct = await findProductById(product.productId);
        const p = { price: foundProduct.product_price, name: foundProduct.product_name, ...product }
        const updateOrInsert = { $addToSet: { cart_products: p }, cart_count_product: +1 }
        const options = { upsert: true, new: true }
        // Upsert là một thuật ngữ kết hợp giữa "insert" và "update".
        return await Cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    // method update số lượng
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        // tìm trong mảng "'cart_products.productId':productId" 
        const query = {
            cart_userId: convertToObjectIdMongodb(userId),
            'cart_products.productId': productId, cart_status: 'active'
        }
        //   $  là update chính product được tìm thấy trong mảng
        const updateSet = { $inc: { "cart_products.$.quantity": quantity ,new:true}  }
        const options = { upsert: true, new: true }
        // Upsert là một thuật ngữ kết hợp giữa "insert" và "update".
        const newCart= await Cart.findOneAndUpdate(query, updateSet, options)
        return newCart
    }
    // thêm sản phẩm và giỏ
    static async addToCart({ product , userId }) {
        const userCart = await Cart.findOne({ cart_userId: convertToObjectIdMongodb(userId) })
        if (!userCart) {
            return await this.createUserCart(userId, product);
        }
        if (userCart.cart_count_product === 1) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        return await this.updateUserCartQuantity(userId, product);
    }
    // {
    // shop_order_id:[{
    //     shopId,
    //     item_products:[
    //         {
    //             productId,
    //             price,
    //             shopId,
    //             old_quantity,
    //             quantity
    //         }
    //     ]
    // }]
    // version
    // }
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_product[0]
        const foundProduct = await findProductById(productId)
        //kiểm tra product có tồn tại không?
        if (!foundProduct) throw new NotFoundError('')
        // compare 
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('product do not belong to shop')
        }
        if (quantity === 0) {

        }
        
        return await this.updateUserCartQuantity({
            userId, product: {
                productId,
                // vd : quantity =10   old_quantity=8 thì quantity: 10-8 =2  <=> quantity:+2
                // vd : quantity =8   old_quantity=10 thì quantity: 8-10 =-2  <=> quantity:-2
                quantity: quantity - old_quantity
            }
        })
    }

    static async delete(userId, productId) {
        const query = { cart_userId: convertToObjectIdMongodb(userId), cart_status: 'active' }
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        return await Cart.updateOne(query, updateSet)
    }
    static async getListUserCart({userId}) {
        return await Cart.find({ cart_userId: convertToObjectIdMongodb(userId) }).lean()
    }
}


module.exports = CartService