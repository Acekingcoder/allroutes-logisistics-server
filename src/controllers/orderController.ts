import { errorHandler } from "../middlewares/errorMiddleware";
import orderModel from "../models/orderModel";
import { NextFunction, Request, Response } from "express";

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = new orderModel({
      ...req.body,
      customer: req.user.userId,
    });
    await order.save();
    return res.status(201).json({ message: "Order created successfully", order });
  } catch (error: any) {
    errorHandler(error, req, res, next);
  }
}
