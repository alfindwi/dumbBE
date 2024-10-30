import { Request, Response } from "express";
import { UpdateUserDTO } from "../dto/user-dto";
import { getUserService, updateUserService } from "../services/userService";
import * as userService from "../services/userService";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = res.locals.user.id;
    const body: UpdateUserDTO = req.body;

    const user = await userService.updateUserService(id, body, req.file);

    res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserService();

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
