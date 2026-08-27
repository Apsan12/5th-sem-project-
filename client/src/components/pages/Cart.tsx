import { FiTrash } from "react-icons/fi";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import type { ICart } from "../../types/ICart";
import { useContext, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, type UserContextType } from "../../contexts/UserContext";
import type { IPaymentInitiateResponse } from "../../types/IPayment";

export default function CartPage() {
    const navigate = useNavigate();

    const { user, setUser } =
        useContext<UserContextType>(UserContext);

    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // Delivery fee
    const DELIVERY_FEE = 0;

    // Check login and get user
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(`${import.meta.env.VITE_API_URL}/user`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                toast.error("Failed to load user", {
                    theme: "colored",
                });
            });
    }, []);

    useEffect(() => {
        if (!user) return;

        if (!user.cart || user.cart.length === 0) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [user]);

    // Cart subtotal
    const cartTotal = useMemo(() => {
        if (!user) return 0;

        return user.cart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0,
        );
    }, [user]);

    // Final total
    const netTotal = cartTotal + DELIVERY_FEE;

  
    const handleClearCart = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .delete(`${import.meta.env.VITE_API_URL}/user/cart/remove/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message, {
                    theme: "colored",
                });

                setUser!(res.data.user);
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message ||
                        "Failed to clear cart",
                    {
                        theme: "colored",
                    },
                );
            });
    };

    // =========================
    // REMOVE PRODUCT
    // =========================
    const handleRemoveFromCart = (cartId: string) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .delete(
                `${import.meta.env.VITE_API_URL}/user/cart/remove/${cartId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            )
            .then((res) => {
                toast.success(res.data.message, {
                    theme: "colored",
                });

                setUser!(res.data.user);
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message ||
                        "Failed to remove product",
                    {
                        theme: "colored",
                    },
                );
            });
    };

    // =========================
    // KHALTI PAYMENT
    // =========================
    const handlePayment = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!user) {
            toast.error("User information not found", {
                theme: "colored",
            });
            return;
        }

        // Check cart
        if (!user.cart || user.cart.length === 0) {
            toast.error("Your cart is empty", {
                theme: "colored",
            });
            return;
        }

        // Check address
        if (
            !user.addresses ||
            user.addresses.length === 0
        ) {
            toast.error(
                "Shipping Address is missing. Please add an address from your profile.",
                {
                    theme: "colored",
                },
            );
            return;
        }

        try {
            setLoading(true);

            // Product information
            const productDetails = user.cart.map((item) => ({
                identity: item._id,
                name: item.product,

                // Khalti expects paisa
                total_price:
                    item.price * item.qty * 100,

                quantity: item.qty,

                // Unit price in paisa
                unit_price: item.price * 100,
            }));

            // Send final amount including delivery
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/initiate`,
                {
                    amount: netTotal,

                    purchase_order_id:
                        `ORDER-${Date.now()}`,

                    purchase_order_name:
                        "Apsan Electronics Store Order",

                    customer_info: {
                        name: user.fullName,
                        email: user.email,
                        phone: user.phone,
                    },

                    product_details: productDetails,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );

            const data =
                response.data as IPaymentInitiateResponse;

            // Redirect to Khalti
            window.location.href =
                data.payment_url;
        } catch (err: any) {
            toast.error(
                err.response?.data?.detail ||
                    err.response?.data?.message ||
                    "Payment initialization failed",
                {
                    theme: "colored",
                },
            );

            setLoading(false);
        }
    };

    return (
        <>
            <Header color="light" />

            <div className="m-auto mx-30 mt-12 mb-4 min-h-screen grid grid-cols-3 gap-8">

                {/* =========================
                    LEFT - CART
                ========================== */}
                <div className="flex flex-col gap-8 col-span-2">

                    {/* STORE NAME */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-700">
                            Apsan Electronics Store
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Review your products before payment
                        </p>
                    </div>

                    {/* CART HEADER */}
                    <div className="w-full flex justify-between items-center">

                        <h6 className="text-slate-700">
                            You have{" "}
                            {user?.cart
                                ? user.cart.length
                                : 0}{" "}
                            products in your cart
                        </h6>

                        <button
                            className={clsx(
                                "py-3 px-4 flex items-center gap-2 rounded-md font-bold text-white",
                                disabled
                                    ? "bg-slate-400"
                                    : "hover:bg-slate-500 bg-slate-600 cursor-pointer",
                            )}
                            disabled={disabled}
                            onClick={handleClearCart}
                        >
                            <FiTrash />
                            Delete Cart
                        </button>
                    </div>

                    {/* CART TABLE */}
                    <div className="w-full rounded-md overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-slate-600 text-white">

                                <tr>
                                    <th className="p-4">
                                        Product
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Subtotal
                                    </th>

                                    <th>
                                        Remove
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {!user?.cart
                                    ? null
                                    : user.cart.map(
                                          (
                                              item: ICart,
                                          ) => (
                                              <tr
                                                  key={
                                                      item._id
                                                  }
                                                  className="border-b cursor-pointer hover:bg-slate-50"
                                                  onClick={() => {
                                                      navigate(
                                                          `/products/${item.productId}`,
                                                      );
                                                  }}
                                              >

                                                  {/* PRODUCT */}
                                                  <td className="p-4">

                                                      <div className="flex items-center gap-4">

                                                          <img
                                                              src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                                              alt={
                                                                  item.product
                                                              }
                                                              className="w-24 h-20 object-cover rounded"
                                                          />

                                                          <span className="font-semibold">
                                                              {
                                                                  item.product
                                                              }
                                                          </span>

                                                      </div>

                                                  </td>

                                                  {/* PRICE */}
                                                  <td className="text-center font-bold text-amber-500">
                                                      NRS{" "}
                                                      {item.price.toLocaleString()}
                                                  </td>

                                                  {/* QUANTITY */}
                                                  <td className="text-center font-bold">
                                                      {item.qty}
                                                  </td>

                                                  {/* SUBTOTAL */}
                                                  <td className="text-center font-bold text-green-500">
                                                      NRS{" "}
                                                      {(
                                                          item.price *
                                                          item.qty
                                                      ).toLocaleString()}
                                                  </td>

                                                  {/* DELETE */}
                                                  <td className="text-center">

                                                      <button
                                                          className="bg-slate-600 text-white p-3 rounded-md cursor-pointer hover:bg-red-500"
                                                          onClick={(
                                                              e,
                                                          ) => {
                                                              e.stopPropagation();

                                                              handleRemoveFromCart(
                                                                  item._id,
                                                              );
                                                          }}
                                                      >
                                                          <FiTrash />
                                                      </button>

                                                  </td>

                                              </tr>
                                          ),
                                      )}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* =========================
                    RIGHT - CHECKOUT
                ========================== */}
                <div className="py-4">

                    <div className="border border-slate-300 rounded-xl p-6 shadow-sm">

                        {/* STORE */}
                        <div className="mb-6">

                            <h2 className="text-2xl font-bold text-slate-700">
                                Checkout
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Apsan Electronics Store
                            </p>

                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="flex flex-col gap-4">

                            <div className="flex justify-between">
                                <span>
                                    Subtotal
                                </span>

                                <span className="font-semibold">
                                    NRS.{" "}
                                    {cartTotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Delivery Fee
                                </span>

                                <span className="font-semibold">
                                    NRS.{" "}
                                    {DELIVERY_FEE.toLocaleString()}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between text-lg font-bold">

                                <span>
                                    Total
                                </span>

                                <span className="text-green-500">
                                    NRS.{" "}
                                    {netTotal.toLocaleString()}
                                </span>

                            </div>

                        </div>

                        {/* PAYMENT BUTTON */}
                        <button
                            className={clsx(
                                "mt-8 p-4 w-full font-bold text-white rounded-lg transition",
                                disabled ||
                                    loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 cursor-pointer",
                            )}
                            disabled={
                                disabled ||
                                loading
                            }
                            onClick={
                                handlePayment
                            }
                        >

                            {loading
                                ? "Processing..."
                                : "Pay with Khalti"}

                        </button>

                        <p className="text-xs text-center text-slate-400 mt-4">
                            You will be redirected to
                            Khalti to complete your
                            payment.
                        </p>

                    </div>

                </div>

                {/* =========================
                    FOOTER
                ========================== */}
                <div className="w-full col-span-3">
                    <Footer />
                </div>

            </div>
        </>
    );
}
