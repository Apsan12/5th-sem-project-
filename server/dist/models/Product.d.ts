import { type Document } from "mongoose";
export declare enum ProductCategory {
    BASIC = "basic",
    BUSINESS = "business",
    GAMING = "gaming",
    LOW_POWER = "low power",
    WORKSTATION = "workstation"
}
export interface IProduct extends Document {
    images: string[];
    about: string;
    info: Record<string, string>;
    price: number;
    isFeatured: boolean;
    category: ProductCategory;
    hidden: boolean;
}
export declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
//# sourceMappingURL=Product.d.ts.map