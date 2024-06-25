import { errorHandler, generateReference, calcBalance, generateDeliveryCode } from "../utils/helperFunctions";
import Order from "../models/orderModel";
import { Request, Response } from "express";
import * as joi from "../validation/joi";
import { CLOSING_HOUR, ORDER_STATUS, TRX_SERVICE, TRX_TYPE } from "../utils/constants";
import User from "../models/userModel";
import Transaction from '../models/transactionModel';
import { verifyTransaction } from "../utils/paystack";

export async function createOrder(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ error: "User not found. Please login or create an account." });
        const { error, value } = joi.createOrderSchema.validate(req.body, joi.options);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const balance = await calcBalance(user.id);

        const amount = value.amount * 100;  // convert amount to kobo
        if (balance < amount) {
            return res.status(402).json({ error: "Insufficient funds. Please fund your wallet." });
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

        const deliveryCode = await generateDeliveryCode();

        const order = new Order({ ...value, amount, pickupDate, customer: user.id, deliveryCode });

        await Transaction.create({
            user: user.id,
            amount,
            type: TRX_TYPE.debit,
            service: TRX_SERVICE.deliveryPayment,
            reference: await generateReference('DLV')
        });

        // todo -->> send mail to customer on successful order creation
        // todo -->> send mail to all riders to notify them of a new order

        return res.status(201).json({ message: "Order created successfully", order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function getOrders(req: Request, res: Response) {
    const { id, role } = req.user;
    try {
        let orders;
        if (role === "rider") {
            orders = await Order.find({ rider: id }).sort({ createdAt: -1 });
        } else if (role === "customer") {
            orders = await Order.find({ customer: id }).sort({ createdAt: -1 });
        } else {
            orders = await Order.find().sort({ createdAt: -1 });
        }
        return res.json({ orders });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    const { role } = req.user;
    try {
        let order;
        if (role === "rider") {
            order = await Order.findOne({ _id: orderId, rider: req.user.id }).populate('customer');
        } else if (role === "customer") {
            order = await Order.findOne({ _id: orderId, customer: req.user.id }).populate('rider');
        } else {
            order = await Order.findById(orderId).populate("customer").populate("rider");
        }
        if (!order) return res.status(404).json({ error: "Order not found" });
        return res.json({ order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function acceptPickupRequest(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.rider = req.user.id;
        order.progressTracker = 1;
        await order.save();

        return res.json({ message: "Order assigned to rider", order });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function pickUpDelivery(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = "picked-up";
        order.progressTracker = 2;
        await order.save();

        return res.json({ message: "Order has been pickup by rider", order });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function deliverPackage(req: Request, res: Response) {
    const { orderId } = req.params;
    const deliveryCode = req.body.deliveryCode;
    if (!deliveryCode) return res.status(400).json({ error: "Delivery code is required" });

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (order.deliveryCode !== deliveryCode) return res.status(400).json({ error: "Invalid delivery code" });

        order.status = ORDER_STATUS.delivered;
        order.progressTracker = 3;
        order.deliveryCode = '';
        await order.save();

        // todo --> send mail to customer on successful delivery

        // todo --> implement notification logic here

        return res.json({ message: "Order has been delivered", order });
    } catch (error) {
        errorHandler(error, res);
    }
}


/** Fund wallet controller to make delivery payments */
export async function fundWallet(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { reference } = req.body;
        if (!reference) {
            return res.status(400).json({ message: "Reference is missing in request body" });
        }

        const processed = await Transaction.findOne({ reference });
        if (processed) {
            return res.status(400).json({ message: "Transaction already processed" });
        }

        const response = await verifyTransaction(reference);
        if (!response.status) {
            res.status(422);
            return res.json({
                success: false,
                message: "Transaction failed",
                error: "Could not confirm transaction"
            })
        }

        const { amount } = response.data;

        await Transaction.create({
            amount,
            transactionType: TRX_TYPE.credit,
            service: TRX_SERVICE.walletFunding,
            user: userId,
            reference
        });

        return res.json({
            success: true,
            message: "Wallet funded successfully",
            amount,
        });

    } catch (error: any) {
        errorHandler(error, res);
    }
}