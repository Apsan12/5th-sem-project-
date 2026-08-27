import type { Request, Response } from "express";
import type { IPaymentPayload } from "../types/PaymentPayload.js";
declare const PaymentController: {
    initializePayment(req: Request<{}, {}, IPaymentPayload>, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default PaymentController;
//# sourceMappingURL=PaymentController.d.ts.map