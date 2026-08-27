import { model, Schema } from "mongoose";
export var ProductCategory;
(function (ProductCategory) {
    ProductCategory["BASIC"] = "basic";
    ProductCategory["BUSINESS"] = "business";
    ProductCategory["GAMING"] = "gaming";
    ProductCategory["LOW_POWER"] = "low power";
    ProductCategory["WORKSTATION"] = "workstation";
})(ProductCategory || (ProductCategory = {}));
const productSchema = new Schema({
    images: { type: [String], required: true },
    about: { type: String, required: true },
    info: { type: Map, of: String, required: true },
    price: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    category: {
        type: String,
        enum: Object.values(ProductCategory),
        default: ProductCategory.BASIC,
    },
});
export const Product = model("products", productSchema);
//# sourceMappingURL=Product.js.map