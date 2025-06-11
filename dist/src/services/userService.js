"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserService = exports.updateUserService = void 0;
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
const prisma_1 = require("../libs/prisma");
const updateUserService = async (id, body, file) => {
    try {
        let updateData = {
            ...body,
        };
        if (file) {
            const uploadAvatar = await (0, cloudinary_1.default)(file);
            updateData.image = uploadAvatar.secure_url;
        }
        if (body.email) {
            updateData.email = body.email;
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: {
                id,
            },
            data: updateData,
        });
        const { email, password, ...dataUser } = updatedUser;
        return dataUser;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error}`);
    }
};
exports.updateUserService = updateUserService;
const getUserService = async () => {
    try {
        const users = await prisma_1.prisma.user.findMany();
        return users;
    }
    catch (error) {
        throw new Error(`Error getting users: ${error}`);
    }
};
exports.getUserService = getUserService;
