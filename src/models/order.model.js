"use strict"
const mongoose = require('mongoose'); // Erase if already required
const { Schema } = require('mongoose');

// Declare the Schema of the Mongo model
// Lưu trữ key jwt
const OrderSchema = new mongoose.Schema({
    order_userId: {
        type: Schema.Types.ObjectId,
        ref: "shop"
    },
    order_checkout: { type: Object, default: {} },
    /*
    order_checkout={
       totalPrice,
       totalApllyDiscount,
       freeShip
    },
    */
    order_shipping: { type: Object, default: {} },
    /*
       street,
       city,
       state,
       country
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber:{type:String,default:"#000107012004"},
    order_status:{type:String, enum:['pending',"confirm","shipped",'cancelled'],default:"pending"}
});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);