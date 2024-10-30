import { UpdateUserDTO } from "../dto/user-dto";
import uploader from "../libs/cloudinary";
import { prisma } from "../libs/prisma";

export const updateUserService = async (
  id: number,
  body: UpdateUserDTO,
  file?: Express.Multer.File
) => {
  try {
    let updateData: Partial<UpdateUserDTO> = {
      ...body,
    };

    if (file) {
      const uploadAvatar = await uploader(file);
      updateData.image = uploadAvatar.secure_url; 
    }

    if (body.email) {
      updateData.email = body.email;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
    });

    const { email, password, ...dataUser } = updatedUser;

    return dataUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
};

export const getUserService = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error(`Error getting users: ${error}`);
  }
};
