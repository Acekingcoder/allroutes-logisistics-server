import { Request, Response } from "express";
import userModel, { UserDocument } from "../models/userModel";
import bcyrpt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    const hashedPassword = await bcyrpt.hash(password, 10);

    const newUser = await userModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (error:any) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deleteUser = await userModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        deleteUser,
      },
    });
  } catch (error:any) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.firstName = firstName || existingUser.firstName;
    existingUser.lastName = lastName || existingUser.lastName;
    existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
    existingUser.email = email || existingUser.email;
    existingUser.password = password || existingUser.password;

    const updateUser = await existingUser.save();

    res.status(200).json({
      status: "success",
      data: {
        updateUser,
      },
    });
  } catch (error:any) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error:any) {
    res
      .status(500)
      .json({ message: "Failed to get user", error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error:any) {
    res
      .status(500)
      .json({ message: "Failed to get all users", error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid email or password" });

    const isPasswordValid = await bcyrpt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid email or password" });

    // const code = generateCode();

    // user.code = code;
    // await user.save();

    // await sendLoginCode(email, code);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2d",
      }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const verifyCode = async (req: Request, res: Response) => {
//   const { email, code } = req.body;
//   try {
//     const user: UserDocument | null = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!validateCode(code, user.code)) {
//       return res.status(401).json({ error: "Invalid verification code" });
//     }
//     user.code = undefined;

//     await user.save();

//     return res.status(200).json({ message: "Verification successful!" });
//   } catch (error) {}
// };
