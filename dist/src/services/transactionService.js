"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransaction = void 0;
const prisma_1 = require("../libs/prisma");
const getTransaction = async () => {
    try {
        const transactions = await prisma_1.prisma.order.findMany({
            include: {
                user: true,
                OrderItems: {
                    select: {
                        product: true,
                    }
                },
            },
        });
        return transactions;
    }
    catch (error) {
        throw new Error(`Error retrieving transaction: ${error.message}`);
    }
};
exports.getTransaction = getTransaction;
