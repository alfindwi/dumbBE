"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.createCategory = void 0;
const prisma_1 = require("../libs/prisma");
const createCategory = async (body) => {
    try {
        const category = await prisma_1.prisma.category.create({
            data: {
                name: body.name,
            }
        });
        return category;
    }
    catch (error) {
        throw new Error(`Error creating product: ${error}`);
    }
};
exports.createCategory = createCategory;
const getCategory = async () => {
    try {
        const category = await prisma_1.prisma.category.findMany();
        return category;
    }
    catch (error) {
        throw new Error(`Error getting products: ${error}`);
    }
};
exports.getCategory = getCategory;
const updateCategory = async (id, body) => {
    try {
        const existingCategory = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        const category = await prisma_1.prisma.category.update({
            where: {
                id,
            },
            data: body,
        });
        return category;
    }
    catch (error) {
        throw new Error(`Error updating product: ${error}`);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    try {
        await prisma_1.prisma.category.delete({
            where: {
                id,
            },
        });
    }
    catch (error) {
        throw new Error(`Error deleting product: ${error}`);
    }
};
exports.deleteCategory = deleteCategory;
