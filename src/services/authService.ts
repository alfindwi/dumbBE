import { LoginDto, RegisterDto } from "../dto/authDto";
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (data: LoginDto) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        image: user.image,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
      },
      process.env.JWT_SECRET || "jifioqahdiwaio!jdoi2123k1",
      {
        expiresIn: "1d",
      }
    );

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
  } catch (error) {
    console.log("Login error:", error);
  }
};

export const register = async (data: RegisterDto) => {
  const existedUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existedUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return user;
};
