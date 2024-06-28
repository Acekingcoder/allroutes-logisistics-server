import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import * as joi from "../validation/joi";
import { attachToken, signToken } from "../utils/jwt";
import Token from '../models/tokenModel';
import sendMail, { getPasswordResetHTML } from "../utils/sendMail";
import { calcBalance, errorHandler, passwordCheck } from "../utils/helperFunctions";
import Rider from '../models/ridersModel';
import Admin from '../models/admin';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = joi.createUserSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        if (await User.findOne({ email: value.email }) || await Rider.findOne({ email: value.email }))
            return res.status(409).json({ error: "Email has been used" });

        const result = passwordCheck(value.password);
        if (result.error)
            return res.status(400).json({ message: result.error });
        const user = await User.create({ ...value, password: await bcrypt.hash(value.password, 10) });

        res.status(201).json({message: 'New customer created successfully', userId: user.id});

    } catch (error: any) {
        errorHandler(error, res);
    }
};

// export const updateUser = async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     const { firstName, lastName, phoneNumber, email, password } = req.body;

//     try {
//         const existingUser = await User.findById(userId);

//         if (!existingUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         existingUser.firstName = firstName || existingUser.firstName;
//         existingUser.lastName = lastName || existingUser.lastName;
//         existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
//         existingUser.email = email || existingUser.email;
//         existingUser.password = password || existingUser.password;

//         const updateUser = await existingUser.save();

//         res.status(200).json({
//             status: "success",
//             updateUser,
//         });
//     } catch (error: any) {
//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

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
    const { role } = req.query;
    try {
        switch (role) {
            case 'customer':
                return res.json(await User.find().select('-password -__v'));
            case 'rider':
                return res.json(await Rider.find().select('-password -__v'));
            case 'admin':
                return res.json(await Admin.find().select('-password -__v'));
            default:
                return res.status(400).json({ error: 'Invalid role query parameter' });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = joi.loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
        const user = await User.findOne({ email: value.email });
        if (!user) {
            // check if user is a rider
            return next();
        }

        const isValid = await bcrypt.compare(value.password, user.password as string);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials!" });

        const token = signToken(user);
        attachToken(token, res);

        const { _id: id, firstName, lastName, phoneNumber, email, role } = user;
        return res.json({ message: 'Login successful', token, user: { id, firstName, lastName, phoneNumber, email, role } });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

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

        const sendMailResult = await sendMail(value.email, 'AllRoute: Password Reset', getPasswordResetHTML(user.firstName, token.otp));
        if (!sendMailResult.success) return res.status(535).json({ message: 'Failed to send email', error: sendMailResult.message });

        return res.json({
            message: 'Check your email for password reset token',
        });

    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email is required in the request query' });
        const { error, value } = joi.resetPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const { newPassword, otp } = value;
        const result = passwordCheck(newPassword);
        if (result.error) return res.status(400).json({ error: result.error });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const now = new Date();
        const token = await Token.findOne({ otp, type: 'password', user: user._id });
        if (!token) return res.status(400).json({ error: 'Invalid token' });
        if (token.expires < now.getTime()) {
            return res.status(400).json({ error: 'Expired token. Please make a new forgot password request.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await token.deleteOne();

        return res.json({
            message: 'Password reset successful'
        });

    } catch (error: any) {
        errorHandler(error, res);
    }
}

// admin delete user function
export async function deleteUserById(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const userBalance = await calcBalance(userId);
        if (userBalance) return res.status(400).json({
            message: "Failed to delete user",
            error: "User account balance is not zero"
        });

        await user.deleteOne();
        res.json({ message: 'User account deleted successfully' });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export async function getProfile(req: Request, res: Response) {
    const {id: userId, role} = req.user;

    try {
        if (role === 'customer') {
            const user = await User.findById(userId).select('-password -__v -updatedAt');
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json({
                ...user.toJSON(),
                walletBalance: await calcBalance(userId),
            });
        } else if (role === 'rider') {
            const rider = await Rider.findById(userId).select('-password -__v -updatedAt');
            if (!rider) return res.status(404).json({ message: "Rider not found" });
            res.json(rider);
        } else {
            const admin = await Admin.findById(userId).select('-password -__v -updatedAt');
            if (!admin) return res.status(404).json({ message: "Admin not found" });
            res.json(admin);
        }
    } catch (error) {
        errorHandler(error, res);
    }
}

/**Get a minified response of the currently logged in user */
export function getMe(req:Request, res:Response) {
    const {id, email, role} = req.user;
    res.json({id, email, role});
}

/**Logout current user */
export function logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({
        message: 'Logged out successfully',
    });
}