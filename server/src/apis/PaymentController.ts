import axios, { AxiosError } from "axios";
import type { Request, Response } from "express";
import type { IPaymentPayload } from "../types/PaymentPayload.js";

const PaymentController = {
    async initializePayment(
        req: Request<{}, {}, IPaymentPayload>,
        res: Response,
    ) {
        try {
            const paymentResponse = await axios.post(
                "https://dev.khalti.com/api/v2/epayment/initiate/",
                {
                   return_url: `${process.env.FRONTEND_URL}/payment-verify`,
website_url: process.env.FRONTEND_URL,

                    // Total amount in paisa
                    // No delivery fee added
                    amount: req.body.amount * 100,

                    purchase_order_id: req.body.purchase_order_id,
                    purchase_order_name: req.body.purchase_order_name,

                    customer_info: req.body.customer_info,

                    amount_breakdown: [
                        {
                            label: "Mark Price",
                            amount: req.body.amount * 100,
                        },
                        {
                            label: "Delivery Fee",
                            amount: 0,
                        },
                    ],

                    product_details: req.body.product_details,

                    merchant_username: "Apsan Electronics Store", 
                    merchant_extra: "Apsan  Electronics Store",
                },
                {
                    headers: {
                        Authorization: `key ${process.env.KHALTI_AUTH_KEY}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            return res.status(200).json(paymentResponse.data);
        } catch (error) {
            const err = error as AxiosError;

            const statusCode = err.response?.status ?? 500;
            const body = err.response?.data ?? {
                message: "Payment initialization failed",
            };

            return res.status(statusCode).json(body);
        }
    },
};

export default PaymentController;