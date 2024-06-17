import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import Wallet from "../models/walletModel";
import * as joi from "../validation/joi";
import { attachToken, generateToken } from "../utils/jwt";
import Token from '../models/tokenModel';
import sendMail from "../services/mailServices";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = joi.createUserSchema.validate(req.body);
        if (error) return res.status(400).json(error.message);
        let newUser = await User.findOne({ email: value.email });
        if (newUser) return res.status(409).json({ error: "Email has been used" });
        newUser = await User.create({ ...value, password: await bcrypt.hash(value.password, 10) });

        try {
            // reason for this try-catching is to ensure that if wallet creation fails, the user is deleted
            await Wallet.create({ customerId: newUser._id });
        } catch {
            await newUser.deleteOne();
            throw new Error('wallet creation failed 500');
        }

        res.status(201).json({
            status: "success",
            data: {
                newUser,
            },
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            status: "success",
            data: {
                deleteUser,
            },
        });
    } catch (error: any) {
        res
            .status(500)
            .json({ message: "Failed to delete user", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    const { firstName, lastName, phoneNumber, email, password } = req.body;

    try {
        const existingUser = await User.findById(userId);

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
    } catch (error: any) {
        res
            .status(500)
            .json({ message: "Failed to update user", error: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error: any) {
        res
            .status(500)
            .json({ message: "Failed to get user", error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const user = await User.find();

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error: any) {
        res
            .status(500)
            .json({ message: "Failed to get all users", error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {error, value} = joi.userLoginSchema.validate(req.body);
        if (error) return res.status(400).json({error: error.message});
        const user = await User.findOne({ email: value.email });
        if (!user) return res.status(401).json({ error: "Invalid credentials!" });

        const isValid = await bcrypt.compare(value.password, user.password as string);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials!" });

        // const code = generateCode();

        // user.code = code;
        // await user.save();

        // await sendLoginCode(email, code);

        const token = generateToken(user);
        attachToken(token, res);

        return res.json({ token, user });
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


export async function sendPasswordResetOtp(req: Request, res: Response) {
    try {
        const { error, value } = joi.forgotPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const user = await User.findOne({ email: value.email });

        if (!user) return res.status(404).json({ error: 'User with given email does not exist' });

        let token = await Token.findOne({ user: user._id, type: 'password' });
        if (token) await token.deleteOne();

        token = new Token({
            user: user._id,
            type: 'password',
            otp: Math.random().toString().substring(2, 7)
        });
        await token.save();

        sendMail(value.email, 'AllRoute: Password Reset', `Password reset token: <strong>${token.otp}<strong/>`)
        return res.json({
            message: 'Check your email for password reset token'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}