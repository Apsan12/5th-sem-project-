import mongoose, { type Document } from "mongoose";
export declare enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    RETURNED = "returned",
    CANCELLED = "cancelled"
}
export interface IOrderProduct extends Document {
    product: mongoose.Types.ObjectId;
    qty: number;
}
export interface IOrder extends Document {
    pidx: string;
    customerId: mongoose.Types.ObjectId;
    shippingAddress: string;
    status: OrderStatus;
    products: IOrderProduct[];
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
//# sourceMappingURL=Order.d.ts.map