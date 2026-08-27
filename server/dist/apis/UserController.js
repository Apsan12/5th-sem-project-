import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const UserController = {
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(200).json({
                message: "User Created Successfully",
                user: user,
            });
        }
        catch (error) {
            const e = error;
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },
    async getAllUsers(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admin can access this route" });
            const users = await User.find().select("-password, -__v");
            return res.status(200).json(users);
        }
        catch (error) {
            const e = error;
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admin can access this route" });
            const userInfo = await User.findById(id).select("-password, -__v");
            return res.status(200).json(userInfo);
        }
        catch (error) {
            const e = error;
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },
    async addToCart(req, res) {
        try {
            const item = req.body;
            const user = await User.findById(req.userId);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currenlty disabled" });
            if (user.email === "admin@shop.com")
                return res
                    .status(400)
                    .json({ message: "Admins cannot purchase products" });
            const exist = user.cart.find((c) => c.productId === item.productId);
            if (!exist) {
                user.cart.push(req.body);
                await user.save();
                return res.status(200).json({
                    message: "Item successfully added to cart",
                    user: user,
                });
            }
            else {
                const index = user.cart.findIndex((c) => c.productId === item.productId);
                user.cart[index].qty += item.qty;
                await user.save();
                return res.status(200).json({
                    message: "Item already in cart. Increasing quantity",
                    user: user,
                });
            }
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async removeFromCart(req, res) {
        try {
            const { cartId } = req.params;
            const user = await User.findById(req.userId);
            if (!user)
                return res
                    .status(404)
                    .json({ message: "User does not exists" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            if (user.email === "admin@shop.com")
                return res
                    .status(400)
                    .json({ message: "Admins cannot purchase products" });
            user.cart = user.cart.filter((item) => !item._id.equals(cartId));
            await user.save();
            return res.status(200).json({
                message: `Product ${cartId} removed from cart`,
                user: user,
            });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async removeAllFromCart(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user)
                return res
                    .status(404)
                    .json({ message: "User does not exists" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            if (user.email === "admin@shop.com")
                return res
                    .status(400)
                    .json({ message: "Admins cannot purchase products" });
            user.cart = [];
            await user.save();
            return res
                .status(200)
                .json({ message: "Cart Cleared", user: user });
        }
        catch (err) {
            const e = err;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async getUserCount(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });
            const count = await User.countDocuments();
            res.status(200).json({ message: count });
        }
        catch (error) {
            const e = error;
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    },
    async loginUser(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({ email: email });
            if (!user)
                throw new Error("User does not exist");
            if (user.disabled)
                throw new Error("User is currently disabled");
            if (!(await bcrypt.compare(password, user.password)))
                throw new Error("Incorrect Password");
            console.log(user);
            const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);
            return res.status(200).json({ message: token });
        }
        catch (error) {
            const e = error;
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },
    async getUserProfile(req, res) {
        try {
            const id = req.userId;
            const user = await User.findById(id).select("-password, -__v");
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            return res.status(200).json(user);
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async updateUserProfile(req, res) {
        try {
            const id = req.userId;
            const user = await User.findById(id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            user.fullName = req.body.fullName;
            user.email = req.body.email;
            user.phone = req.body.phone;
            await user.save();
            return res
                .status(200)
                .json({ message: "User Information Updated Successfully" });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async addAddress(req, res) {
        try {
            const id = req.userId;
            const address = req.body.address;
            if (!address || address === "")
                return res
                    .send(400)
                    .json({ message: "Address field is empty" });
            const user = await User.findById(id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            user.addresses.push(address);
            await user.save();
            res.status(200).json({
                message: "Address added to User's Address Book",
            });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async removeAddress(req, res) {
        try {
            const id = req.userId;
            const { index } = req.params;
            if (!index)
                return res
                    .send(400)
                    .json({ message: "Address Index is empty" });
            const user = await User.findById(id).select("-password, -__v");
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            user.addresses.splice(parseInt(index), 1);
            await user.save();
            res.status(200).json({
                message: "Address remove from User's Address Book",
                user: user,
            });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async setDefaultAddress(req, res) {
        try {
            const id = req.userId;
            const { index } = req.params;
            if (!index)
                return res.send(400).json({ message: "Missing Default Value" });
            const user = await User.findById(id).select("-password, -__v");
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.disabled)
                return res
                    .status(404)
                    .json({ message: "User is currently disabled" });
            user.defaultAddress = parseInt(index);
            await user?.save();
            return res.status(200).json({
                message: "Updated Default Shipping Address",
                user: user,
            });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
    async toggleUser(req, res) {
        try {
            const { id } = req.params;
            const admin = await User.findById(req.userId);
            if (admin.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });
            const user = await User.findById(id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (user.email === "admin@shop.com")
                return res
                    .status(400)
                    .json({ message: "Cannot disabled admin" });
            user.disabled = !user.disabled;
            await user.save();
            const users = await User.find();
            if (user.disabled)
                return res.status(200).json({
                    message: `User with id: ${id} is set to disabled`,
                    users: users,
                });
            else
                return res.status(200).json({
                    message: `User with id: ${id} is set to active`,
                    users: users,
                });
        }
        catch (error) {
            const e = error;
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    },
};
export default UserController;
//# sourceMappingURL=UserController.js.map