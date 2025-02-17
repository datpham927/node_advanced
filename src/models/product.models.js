
"use strict"
const { model, Schema } = require('mongoose'); // Erase if already required
const slugify = require("slugify")


// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: String,
    product_thumb: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_description: { type: String, required: true },
    product_type: { type: String, enum: ["Clothing", "Electronics", "Furniture"], required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_quantity: { type: Number, required: true },
    product_attribute: { type: Schema.Types.Mixed, required: true },
    product_ratings: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        mAX: [5, "Rating must be above 5.0"],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false }, //select se khong lay ra khi find 
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: "products",//  display name in mongoose
    timestamps: true
});
// create index for search
// cho phép tìm kiếm văn bản trong các trường đã được chỉ định. Trong trường hợp này,
//  việc tạo chỉ mục văn bản cho product_name và product_description sẽ cho phép tìm kiếm
//   các sản phẩm dựa trên tên và mô tả của sản phẩm.
productSchema.index({ product_name: 'text', product_description: 'text' })

//document middleware : run before .save()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next();
})

const clothingSchema = new Schema({
    product_brand: { type: String, required: true },
    product_size: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_material: { type: String, required: true },
}, {
    timestamps: true
});
const FurnitureSchema = new Schema({
    product_brand: { type: String, required: true },
    product_size: { type: String, required: true }, product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_material: { type: String, required: true },
}, {
    timestamps: true
});


//Export the model
module.exports = {
    product: model('Product', productSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', FurnitureSchema),
}










