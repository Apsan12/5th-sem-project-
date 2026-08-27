import { Product } from "../models/Product.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
const ProductController = {
    async createProduct(req, res) {
        try {
            // Check admin
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com") {
                return res.status(403).json({
                    message: "Only admins can access this route",
                });
            }
            // Get uploaded files
            const files = req.files || [];
            if (files.length === 0) {
                return res.status(400).json({
                    message: "Please provide at least one image",
                });
            }
            // Parse product info
            req.body.info = JSON.parse(String(req.body.info));
            // Create product
            const product = await Product.create(req.body);
            // Public directory
            const publicDir = path.join(process.cwd(), "public");
            // Create public directory if it doesn't exist
            await mkdir(publicDir, { recursive: true });
            // Save images
            const filenames = await Promise.all(files.map(async (file, i) => {
                const ext = path
                    .extname(file.originalname)
                    .toLowerCase();
                const filename = `${product._id}-${i}${ext}`;
                const filePath = path.join(publicDir, filename);
                // IMPORTANT: await the write
                await writeFile(filePath, file.buffer);
                return filename;
            }));
            // Save image names to database
            product.images = filenames;
            await product.save();
            return res.status(200).json({
                message: "Product Added Successfully",
                product,
            });
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async getVisibleProductById(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    message: "Invalid product ID",
                });
            }
            const product = await Product.findOne({
                _id: new mongoose.Types.ObjectId(req.params.id),
                hidden: false,
            });
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async getProductById(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com") {
                return res.status(403).json({
                    message: "Only admins can access this route",
                });
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    message: "Invalid product ID",
                });
            }
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async getAllVisibleProducts(_req, res) {
        try {
            const products = await Product.find({
                hidden: false,
            });
            return res.status(200).json(products);
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async getAllProducts(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com") {
                return res.status(403).json({
                    message: "Only admins can access this route",
                });
            }
            const products = await Product.find();
            return res.status(200).json(products);
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async getProductCount(_req, res) {
        try {
            const count = await Product.countDocuments();
            return res.status(200).json({
                message: count,
            });
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async searchProduct(req, res) {
        try {
            const query = req.query.q;
            // No search query
            if (!query) {
                const products = await Product.find({
                    isFeatured: true,
                });
                return res.status(200).json(products);
            }
            // Empty search query
            if (query.trim() === "") {
                const products = await Product.find([]);
                return res.status(200).json(products);
            }
            const searchValue = query.trim();
            // Escape regex special characters
            const escapedQuery = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedQuery, "i");
            const numericValue = parseFloat(searchValue);
            const conditions = [
                {
                    about: regex,
                },
                {
                    info: regex,
                },
                {
                    images: regex,
                },
            ];
            if (!isNaN(numericValue)) {
                conditions.push({
                    price: numericValue,
                });
            }
            const results = await Product.find({
                $or: conditions,
            }).limit(20);
            return res.status(200).json(results);
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async updateProduct(req, res) {
        try {
            // Check admin
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com") {
                return res.status(403).json({
                    message: "Only admins can access this route",
                });
            }
            const prodId = req.body._id;
            if (!prodId) {
                return res.status(400).json({
                    message: "Product ID is required",
                });
            }
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return res.status(400).json({
                    message: "Invalid product ID",
                });
            }
            // Find product
            const product = await Product.findById(prodId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }
            // Update normal fields
            product.about = req.body.about;
            product.info = JSON.parse(String(req.body.info));
            product.price = req.body.price;
            product.isFeatured = req.body.isFeatured;
            product.category = req.body.category;
            // Get uploaded files
            const files = req.files || [];
            // Only replace images if new images were uploaded
            if (files.length > 0) {
                const publicDir = path.join(process.cwd(), "public");
                // Make sure public directory exists
                await mkdir(publicDir, {
                    recursive: true,
                });
                // Delete old images
                if (product.images && product.images.length > 0) {
                    await Promise.all(product.images.map(async (image) => {
                        try {
                            const oldImagePath = path.join(publicDir, image);
                            await unlink(oldImagePath);
                        }
                        catch (error) {
                            // Ignore if old image doesn't exist
                            if (error.code !== "ENOENT") {
                                console.error("Error deleting old image:", error);
                            }
                        }
                    }));
                }
                // Save new images
                const filenames = await Promise.all(files.map(async (file, i) => {
                    const ext = path
                        .extname(file.originalname)
                        .toLowerCase();
                    const filename = `${product._id}-${i}${ext}`;
                    const filePath = path.join(publicDir, filename);
                    await writeFile(filePath, file.buffer);
                    return filename;
                }));
                product.images = filenames;
            }
            await product.save();
            return res.status(200).json({
                message: "Product Updated Successfully",
                product,
            });
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
    async toggleProduct(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user || user.email !== "admin@shop.com") {
                return res.status(403).json({
                    message: "Only admins can access this route",
                });
            }
            const { prodId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return res.status(400).json({
                    message: "Invalid product ID",
                });
            }
            const product = await Product.findById(prodId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }
            product.hidden = !product.hidden;
            await product.save();
            const products = await Product.find();
            return res.status(200).json({
                message: product.hidden
                    ? "Product set to Hidden"
                    : "Product set to Visible",
                products,
            });
        }
        catch (error) {
            const e = error;
            console.error(error);
            return res.status(500).json({
                message: e.message,
            });
        }
    },
};
export default ProductController;
//# sourceMappingURL=ProductController.js.map