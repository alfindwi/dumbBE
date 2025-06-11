"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const productService = __importStar(require("../services/productService"));
const createProduct = async (req, res) => {
    try {
        const user = res.locals.user;
        if (user.role !== "ADMIN") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        const product = await productService.createProduct(req.body, req.file);
        res.status(200).json({ product, message: "Product created successfully" });
    }
    catch (error) {
        console.log("error", error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({ products });
    }
    catch (error) {
        console.log("error", error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.getProducts = getProducts;
const updateProduct = async (req, res) => {
    try {
        const id = +req.params.id;
        const user = res.locals.user;
        const body = req.body;
        if (user.role !== "ADMIN") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        const product = await productService.updateProduct(id, body, req.file);
        res.status(200).json({ product, message: "Product updated successfully" });
    }
    catch (error) {
        console.log("error", error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = +req.params.id;
        const user = res.locals.user;
        if (user.role !== "ADMIN") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        await productService.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.log("error", error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProduct = deleteProduct;
