"use strict"  // giảm rỏ rỉ bộ nhớ
const mongoose = require('mongoose'); // Erase if already required
const { Schema } = require('mongoose');

// Declare the Schema of the Mongo model 
// hàng tồn kho
const InventorySchema = new mongoose.Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unKnow" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservation: { type: Array, default: [] },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('InventorySchema', InventorySchema);