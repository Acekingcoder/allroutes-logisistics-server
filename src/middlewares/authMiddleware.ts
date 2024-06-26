import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Please login", message: "There is no token provided" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded as IUserPayload;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Please login", message: "Invalid token" });
    }
};

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user;
    if (role !== "admin") {
        return res.status(403).json({ error: "Unauthorized", message: "You must be an admin to access this resource" });
    }
    next();
}

export function authorizeRider(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user;
    if (role !== "rider") {
        return res.status(403).json({ error: "Unauthorized", message: "You must be an rider to access this resource" });
    }
    next();
}

export function authorizeCustomer(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user;
    if (role !== "customer") {
        return res.status(403).json({ error: "Unauthorized", message: "You must be an customer to access this resource" });
    }
    next();
}


//UNUSED
// export async function checkIfAccountStillExist(req: Request, res: Response, next: NextFunction) {
//     switch (req.user.role) {
//         case 'customer':
//             const User = await import("../models/userModel");
//             const user = await User.default.findById(req.user.id);
//             if (!user) return res.status(401).json({ error: "Please login", message: "Could not find this user" });
//         case 'rider':
//             const Rider = await import("../models/ridersModel");
//             const rider = await Rider.default.findById(req.user.id);
//             if (!rider) return res.status(401).json({ error: "Please login", message: "Could not find this rider" });
//         case 'admin':
//             const Admin = await import("../models/admin");
//             const admin = await Admin.default.findById(req.user.id);
//             if (!admin) return res.status(401).json({ error: "Please login", message: "Could not find this admin" });
//     }
//     next();
// }