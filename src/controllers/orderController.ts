import { errorHandler } from "../middlewares/errorMiddleware";
import Order from "../models/orderModel";
import { Request, Response } from "express";
import * as validator from "../validation/joi";
import { CLOSING_HOUR } from "../utils/constants";

export async function createOrder(req: Request, res: Response) {
    try {
        const { error, value } = validator.createOrderSchema.validate(req.body, validator.options);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        let pickupDate = new Date(value.pickupDate);
        const today = new Date();
        if (pickupDate < today) {
            return res.status(400).json({ error: "Invalid pickup date" });
        }
        const hour = today.getHours();
        if (hour >= CLOSING_HOUR) {
            pickupDate.setDate(today.getDate() + 1);
        }

        const order = new Order({...value, pickupDate, customer: req.user.id});
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
        const order = await Order.findById(orderId);
        if (!order || (order.customer.toString() !== req.user.id)) {
            return res.status(404).json({ error: "Order not found" });
        }
        return res.json({ order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

// todo -- to be implemented after riderController is commenced
export async function assignRider(req: Request, res: Response) {
    res.send("Not implemented");
    // const {orderId, riderId} = req.body;
    // try {
    //     const order = await Order.findById(orderId);
    //     if (!order) {
    //         return res.status(404).json({ error: "Order not found" });
    //     }
    //     if (order.status !== "pending") {
    //         return res.status(400).json({ error: "Order has already been assigned" });
    //     }
    //     const rider = await Rider.findById(riderId);
    //     if (!rider) {
    //         return res.status(404).json({ error: "Invalid rider" });
    //     }
    //     order.rider = riderId;
    //     order.status = "assigned";
    //     await order.save();
    //     return res.json({ message: "Rider assigned successfully", order });
    // } catch (error: any) {
    //     errorHandler(error, req, res, next);
    // }
}
