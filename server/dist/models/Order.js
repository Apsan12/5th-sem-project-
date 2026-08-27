import mongoose, { model, Schema } from "mongoose";
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["RETURNED"] = "returned";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (OrderStatus = {}));
const orderProductSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
        sparse: true,
    },
    qty: {
        type: Number,
        default: 1,
    },
});
const orderSchema = new Schema({
    pidx: {
        type: String,
        required: [true, "Transaction PIDX is required"],
        unique: [true, "Order Already Placed"],
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    products: {
        type: [orderProductSchema],
        default: [],
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
    },
}, {
    timestamps: true,
});
export const Order = model("orders", orderSchema);
//# sourceMappingURL=Order.js.map