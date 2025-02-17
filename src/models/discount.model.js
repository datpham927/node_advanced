"use strict"  // giảm rỏ rỉ bộ nhớ
const mongoose = require('mongoose'); // Erase if already required
const { Schema } = require('mongoose');

// Declare the Schema of the Mongo model
// Lưu trữ key jwt
const DiscountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },// mã áp dụng
    discount_start_date: { type: Date, required: true },
    discount_end_code: { type: Date, required: true }, 
    discount_uses_count: { type: Number, required: true },// số discount đã được use
    discount_max_uses: { type: Number, required: true },// số lượng discount đã được áp dụng
    discount_users_used: { type: Array, default: [] },// ai đã sử dụng
    discount_max_users_per_user: { type: Number, required: true },// số lượng cho phép tối đa use for user
    discount_min_order_user: { type: Number, required: true },// giá trị order tối thiểu
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ["all", "specific"] },
    discount_product_ids: { type: Array, default: [] }//  được áp dụng
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('DiscountSchema', DiscountSchema);







