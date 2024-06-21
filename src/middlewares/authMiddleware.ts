import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded as IUserPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Please login" });
    }
};

export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Please login as an admin" });
    }

    try {
        const decoded = verifyToken(token);
        if (decoded.role === "admin") {
            req.user = decoded as IUserPayload;
            return next();
        }
        return res.status(401).json({ message: "Please login as an admin" });
    } catch (error) {
        return res.status(401).json({ message: "Please login as an admin" });
    }
}