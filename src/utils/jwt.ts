import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { IUser } from "../models/userModel";
import { IAdmin } from "../models/admin";
import { IRider } from "../models/ridersModel";

dotenv.config();

/**Token expiration in seconds */
const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 3600;
// const expiresIn = 60 * 60;

const secretKey = process.env.JWT_SECRET as string;

/** Generate a token for the user on successful login */
export function signToken(user: IUser | IAdmin | IRider) {
    const jwtPayload = { id: user._id, role: user.role };
    return jwt.sign(jwtPayload, secretKey, { expiresIn });
}

/** Verify the token sent by the user and returns the decoded token */
export function verifyToken(token: string) {
    return jwt.verify(token, secretKey) as jwt.JwtPayload;
}

/** Attach the token to the authorization headers and save in cookies*/
export function attachToken(token: string, res: Response) {
    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, { maxAge: expiresIn * 1000, httpOnly: true });
}
