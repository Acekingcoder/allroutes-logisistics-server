import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
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

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export function authorizeRider(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== "rider") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export function authorizeCustomer(req: Request, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== "customer") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}