import axios, { AxiosError } from "axios";
const PaymentController = {
    async initializePayment(req, res) {
        try {
            const paymentResponse = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", {
                return_url: "http://localhost:3000/payment-verify",
                website_url: "http://localhost:3000/",
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
            }, {
                headers: {
                    Authorization: `key ${process.env.KHALTI_AUTH_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            return res.status(200).json(paymentResponse.data);
        }
        catch (error) {
            const err = error;
            const statusCode = err.response?.status ?? 500;
            const body = err.response?.data ?? {
                message: "Payment initialization failed",
            };
            return res.status(statusCode).json(body);
        }
    },
};
export default PaymentController;
//# sourceMappingURL=PaymentController.js.map