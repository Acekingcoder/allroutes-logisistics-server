import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import Wallet from "../models/walletModel";
import * as joi from "../validation/joi";
import { attachToken, generateToken } from "../utils/jwt";
import Token from '../models/tokenModel';
import sendMail, { getPasswordResetHTML } from "../utils/sendMail";
import { passwordCheck } from "../utils/helperFunctions";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = joi.createUserSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
        let newUser = await User.findOne({ email: value.email });
        if (newUser) return res.status(409).json({ message: "Email has been used" });
        const result = passwordCheck(value.password);
        if (result.error) return res.status(400).json({ message: result.error });
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
            newUser,
        });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

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
            updateUser,
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({
            status: "success",
            user
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password -__v');

        res.status(200).json({
            status: "success",
            users
        });
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = joi.userLoginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
        const user = await User.findOne({ email: value.email });
        if (!user) return res.status(401).json({ message: "Invalid credentials!" });

        const isValid = await bcrypt.compare(value.password, user.password as string);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials!" });

        const token = generateToken(user);
        attachToken(token, res);

        return res.json({ token, user });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export async function sendPasswordResetOtp(req: Request, res: Response) {
    try {
        const { error, value } = joi.forgotPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const user = await User.findOne({ email: value.email });

        if (!user) return res.status(404).json({ message: 'User with given email does not exist' });

        let token = await Token.findOne({ user: user._id, type: 'password' });
        if (token) await token.deleteOne();

        token = new Token({
            user: user._id,
            type: 'password',
            otp: Math.random().toString().substring(2, 7)
        });
        await token.save();

        const sendMailResult = await sendMail(value.email, 'AllRoute: Password Reset', getPasswordResetHTML(user.firstName, token.otp));
        if (!sendMailResult.success) return res.status(535).json({ message: 'Failed to send email', error: sendMailResult.message });

        return res.json({
            message: 'Check your email for password reset token',
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email is required in the request query' });
        const { error, value } = joi.resetPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const { newPassword, otp } = value;
        const result = passwordCheck(newPassword);
        if (result.error) return res.status(400).json({ message: result.error });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();
        const token = await Token.findOne({ otp, type: 'password', user: user._id });
        if (!token) return res.status(400).json({ message: 'Invalid token' });
        if (token.expires < now.getTime()) {
            return res.status(400).json({ message: 'Expired token. Please make a new forgot password request.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await token.deleteOne();

        return res.json({
            message: 'Password reset successful'
        });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// admin delete user function
export async function deleteUserById(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const wallet = await Wallet.findOne({ customerId: userId });
        const userBalance = wallet?.balance;
        if (userBalance) return res.status(400).json({
            message: "Failed to delete user",
            error: "User account balance is not zero"
        })
        await user.deleteOne();
        if (wallet) await wallet.deleteOne();
        res.json({ message: 'User account deleted successfully' });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// todo --> get user profile controller
// ...