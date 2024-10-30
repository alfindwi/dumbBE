import { CreateCategoryDto, UpdateCategoryDto } from "../dto/categoryDto";
import { prisma } from "../libs/prisma";

export const createCategory = async (
  body: CreateCategoryDto,
) => {
  try {

    const category = await prisma.category.create({
      data: {
        name: body.name,
      }
    });

    return category;
  } catch (error) {
    throw new Error(`Error creating product: ${error}`);
  }
};

export const getCategory = async () => {
  try {
    const category = await prisma.category.findMany();
    return category;
  } catch (error) {
    throw new Error(`Error getting products: ${error}`);
  }
};

export const updateCategory = async (
  id: number,
  body: UpdateCategoryDto,
) => {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: body as any,
    });

    return category;
  } catch (error) {
    throw new Error(`Error updating product: ${error}`);
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(`Error deleting product: ${error}`);
  }
};