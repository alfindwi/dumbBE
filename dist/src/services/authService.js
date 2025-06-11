"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const prisma_1 = require("../libs/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (data) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isValidPassword = await bcrypt_1.default.compare(data.password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            image: user.image,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
        }, process.env.JWT_SECRET || "jifioqahdiwaio!jdoi2123k1", {
            expiresIn: "1d",
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                image: user.image,
                phone: user.phone,
                address: user.address,
                gender: user.gender,
            },
        };
    }
    catch (error) {
        console.log("Login error:", error);
    }
};
exports.login = login;
const register = async (data) => {
    const existedUser = await prisma_1.prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existedUser) {
        throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });
    return user;
};
exports.register = register;
