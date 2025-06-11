"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
const prisma_1 = require("../libs/prisma");
const createProduct = async (body, file) => {
    try {
        const categoryId = parseInt(body.categoryId, 10);
        if (isNaN(categoryId))
            throw new Error("Invalid category ID");
        const category = await prisma_1.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category)
            throw new Error("Category not found with the given ID");
        const createData = {
            product_name: body.product_name ?? "",
            price: body.price ?? "",
            stok: body.stok ?? "",
            product_desc: body.product_desc ?? "",
            image: "",
        };
        if (file) {
            const imageProduct = await (0, cloudinary_1.default)(file);
            createData.image = imageProduct.secure_url;
        }
        const product = await prisma_1.prisma.product.create({
            data: {
                ...createData,
                category: {
                    connect: { id: categoryId },
                },
            },
        });
        return product;
    }
    catch (error) {
        console.error("Error creating product:", error);
        throw new Error(`Error creating product: ${error.message}`);
    }
};
exports.createProduct = createProduct;
const getProducts = async () => {
    try {
        const products = await prisma_1.prisma.product.findMany();
        return products;
    }
    catch (error) {
        throw new Error(`Error getting products: ${error}`);
    }
};
exports.getProducts = getProducts;
const updateProduct = async (id, body, file) => {
    try {
        const existingProduct = await prisma_1.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        let updateData = {
            ...body,
        };
        if (file) {
            const imageProduct = await (0, cloudinary_1.default)(file);
            updateData.image = imageProduct.secure_url;
        }
        else {
            updateData.image = existingProduct.image ?? "";
        }
        const product = await prisma_1.prisma.product.update({
            where: {
                id,
            },
            data: updateData,
        });
        return product;
    }
    catch (error) {
        throw new Error(`Error updating product: ${error}`);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    try {
        await prisma_1.prisma.product.delete({
            where: {
                id,
            },
        });
    }
    catch (error) {
        throw new Error(`Error deleting product: ${error}`);
    }
};
exports.deleteProduct = deleteProduct;
