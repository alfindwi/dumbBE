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
exports.deleteCartItem = exports.updateCartItem = exports.createCartItem = exports.getCart = void 0;
const cartService = __importStar(require("../services/cartService"));
const getCart = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const cart = await cartService.getCart(userId);
        res.status(200).json({ cart });
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.getCart = getCart;
const createCartItem = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { productId } = req.body;
        const cartItem = await cartService.createCartItem(userId, productId);
        res.status(200).json({ cartItem });
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.createCartItem = createCartItem;
const updateCartItem = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { newQuantity } = req.body;
        const cartItemId = parseInt(req.params.id);
        const updatedCartItem = await cartService.updateCartItem(userId, cartItemId, newQuantity);
        res.status(200).json({ updatedCartItem });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateCartItem = updateCartItem;
const deleteCartItem = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const cartItemId = parseInt(req.params.id);
        await cartService.deleteCartItem(cartItemId, userId);
        res.status(200).json({ message: "Cart item deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCartItem = deleteCartItem;
