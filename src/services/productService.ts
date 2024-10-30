import { CreateProductDto, UpdateProductDto } from "../dto/productDto";
import uploader from "../libs/cloudinary";
import { prisma } from "../libs/prisma";

export const createProduct = async (
  body: CreateProductDto,
  file?: Express.Multer.File
) => {
  try {
    const categoryId = parseInt(body.categoryId, 10);
    if (isNaN(categoryId)) throw new Error("Invalid category ID");


    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) throw new Error("Category not found with the given ID");

    const createData: Omit<Required<CreateProductDto>, "categoryId"> = {
      product_name: body.product_name ?? "",
      price: body.price ?? "",
      stok: body.stok ?? "",
      product_desc: body.product_desc ?? "",
      image: "", 
    };

    if (file) {
      const imageProduct = await uploader(file);
      createData.image = imageProduct.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        ...createData,
        category: {
          connect: { id: categoryId },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(`Error creating product: ${(error as Error).message}`);
  }
};

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    throw new Error(`Error getting products: ${error}`);
  }
};

export const updateProduct = async (
  id: number,
  body: UpdateProductDto,
  file?: Express.Multer.File
) => {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    let updateData: Partial<UpdateProductDto> = {
      ...body,
    };

    if (file) {
      const imageProduct = await uploader(file);
      updateData.image = imageProduct.secure_url;
    } else {
      updateData.image = existingProduct.image ?? "";
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: updateData,
    });

    return product;
  } catch (error) {
    throw new Error(`Error updating product: ${error}`);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(`Error deleting product: ${error}`);
  }
};