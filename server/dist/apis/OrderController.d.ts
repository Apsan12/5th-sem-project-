import type { Response } from "express";
import { OrderStatus, type IOrderProduct } from "../models/Order.js";
import type { MyRequest } from "../types/Request.js";
declare const OrderController: {
    createOrder(req: MyRequest<{}, {}, {
        pidx: string;
        products: IOrderProduct[];
        shippingAddress: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
    getOrderCount(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllOrder(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderByUserId(req: MyRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderInfo(req: MyRequest<{
        orderId: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderStatus(req: MyRequest<{}, {}, {
        pidx: string;
        orderId: string;
        status: OrderStatus;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    cancelOrder(req: MyRequest<{}, {}, {
        orderId: string;
        pidx: string;
    }>, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default OrderController;
//# sourceMappingURL=OrderController.d.ts.map