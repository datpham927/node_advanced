"use strict"
const mongoose = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = "cart"
const COLLECTION_NAME = "carts"

const cartSchema = new mongoose.Schema({
    cart_status: {
        type: String,
        require: true,
        enum: ["active", 'completed', "failed", 'pending'], default: 'active'
    },
    cart_products: { type: Array, require: true, default: [] },
    //  {
    //     productId,
    //     shopId,
    //     quantity,
    //     name
    //     price
    //  }
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
}, {
    timestamp: true,
   timestamps:{
      createdAt:"createOn", // thây đổi tên col
      updatedAt:"modifiedOn"
   }
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);