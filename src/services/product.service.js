const { BadRequestRequestError } = require("../core/error.response");
const { product, clothing, furniture } = require("../models/product.models");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { findAllDraftsForShop, publicProductByShop, findAllPublishForShop, unPublicProductByShop, searchProductByUser, findAllProducts, updateProductById } = require("../models/repositories/product.repo");
const { getUnselectData, updateNestedObjectParser } = require("../utils");


class ProductFactory {
    static createProduct = async (type, payload) => {
        if (!payload) throw new BadRequestRequestError("not payload");
        switch (type) {
            case "Clothing": return new Clothing(payload).createProduct()
            case "Furniture": return new Furniture(payload).createProduct()
        }
    }

    static updateProduct = async (type, productId, payload) => {
        if (!payload) throw new BadRequestRequestError("not payload");
        switch (type) {
            case "Clothing": return new Clothing(payload).updateProduct(productId)
            case "Furniture": return new Furniture(payload).updateProduct(productId)
        }
    }
    //get product nháp
    static getAllDraftForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
    //get  product công khai
    static getAllPublishForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }
    // update product công khai
    static publicProductForShop = async ({ product_shop, product_id }) => {
        return await publicProductByShop({ product_shop, product_id })
    }
    static unPublicProductForShop = async ({ product_shop, product_id }) => {
        return await unPublicProductByShop({ product_shop, product_id })
    }
    //   -------------------------------------
    static searchProductsByUser = async ({ keySearch }) => {
        return await searchProductByUser({ keySearch })
    }
    static findAllProducts = async ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) => {
        return await findAllProducts({ limit, sort, page, filter, select: ["product_name", "product_price", "product_thumb"] })
    }
    //detail
    static findProduct = async ({ product_id, unselect }) => {
        return await product
            .findById(product_id)
            .select(getUnselectData(unselect))
            .lean()
    }
}

class Product {
    constructor({ product_name, product_thumb, product_price, product_description,
        product_type, product_shop, product_quantity, product_attribute }) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_price = product_price,
            this.product_description = product_description,
            this.product_description = product_description,
            this.product_type = product_type,
            this.product_shop = product_shop,
            this.product_quantity = product_quantity,
            this.product_attribute = product_attribute
    }
    async createProduct(productId) {
        // nhận vào _id để 2 bảng đồng nhất
        const newProduct = await product.create({ _id: productId, ...this })

        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: newProduct.product_shop,
                stock: newProduct.product_quantity,
                // location: location
            })
        }
        return newProduct
    }
    async updateProduct(productId, payload) {
        return await updateProductById({ id: productId, model: product, payload })
    }
}


class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attribute);
        if (!newClothing) throw new BadRequestRequestError("Create new clothing error!",)
        //  Tạo product
        const newProduct = await super.createProduct(newClothing._id)

        if (!newProduct) throw new BadRequestRequestError("Create new product error!")
        return newProduct
    }
    async updateProduct(productId) {
        const objectParams = this
        if (objectParams.product_attribute) {
            await updateProductById({ id: productId, model: clothing, payload: updateNestedObjectParser(objectParams.product_attribute) })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }

}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attribute,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestRequestError("Create new furniture error!")
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestRequestError("Create new product error!")
        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = this
        if (objectParams.product_attribute) {
            await updateProductById({ id: productId, model: furniture, payload: updateNestedObjectParser(objectParams.product_attribute) })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

module.exports = { productService: ProductFactory, findAllProducts }











