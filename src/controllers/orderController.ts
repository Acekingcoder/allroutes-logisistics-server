import { errorHandler } from "../middlewares/errorMiddleware";
import Order from "../models/orderModel";
import { Request, Response } from "express";
import * as joi from "../validation/joi";
import { CLOSING_HOUR } from "../utils/constants";
import User from "../models/userModel";

export async function createOrder(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: "User not found." });
        const { error, value } = joi.createOrderSchema.validate(req.body, joi.options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const today = new Date();
        let pickupDate = today;
        if (value.pickupDate) {
            pickupDate = new Date(value.pickupDate);

            if (pickupDate < today) {
                return res.status(400).json({ message: "Pickup date cannot be in the past" });
            }
        }
        const hour = today.getHours();
        if (hour >= CLOSING_HOUR) {
            // If the current time is past the closing hour, set the pickup date to the next day
            pickupDate.setDate(today.getDate() + 1);
        }

        const order = new Order({ ...value, pickupDate, customer: user.id });
        await order.save();
        return res.status(201).json({ message: "Order created successfully", order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function getOrders(req: Request, res: Response) {
    const role = req.user.role;
    const id = req.user.id;
    try {
        let orders;
        if (role === "customer") {
            orders = await Order.find({ customer: id }).populate("customer").populate("rider");
        } else {
            orders = await Order.find().populate("customer").populate("rider");
        }
        return res.json({ orders });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
        // const order = await Order.findById(orderId);
        const order = await Order.findOne({ _id: orderId, customer: req.user.id });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json({ order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user.id;
    try {
        const order = await Order.findOne({ _id: orderId, customer: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== "pending") {
            return res.status(400).json({ message: "Order cannot be cancelled" });
        }
        order.status = "cancelled";
        await order.save();
        return res.json({ message: "Order cancelled successfully", order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function confirmOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user.id;
    try {
        const order = await Order.findOne({ _id: orderId, customer: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== "pending") {
            return res.status(400).json({ message: "Order has already been confirmed or was cancelled" });
        }

        // todo --> implement payment logic here
        // todo --> implement notification logic here
        // todo --> assign order to a rider

        order.status = "confirmed";
        await order.save();
        return res.json({ message: "Order confirmed successfully", order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}
