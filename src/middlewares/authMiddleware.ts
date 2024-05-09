import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET } = process.env

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
