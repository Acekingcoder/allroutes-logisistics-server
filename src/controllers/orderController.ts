import { errorHandler, generateReference, calcBalance, generateDeliveryCode, generateDispatchNo } from "../utils/helperFunctions";
import Order from "../models/orderModel";
import { Request, Response } from "express";
import * as joi from "../validation/joi";
import { ORDER_STATUS, TRX_SERVICE, TRX_TYPE } from "../utils/constants";
import User, { IUser } from "../models/userModel";
import Transaction from '../models/transactionModel';
import { verifyTransaction } from "../utils/paystack";
import sendMail, { generateCreatedOrderMail, generateOrderDeliveryMail } from "../utils/sendMail";
import { IRider } from "../models/ridersModel";

export async function createOrder(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(401).json({ error: "User not found. Please login or create an account." });
        const { error, value } = joi.createOrderSchema.validate(req.body, joi.options);
        if (error)
            return res.status(400).json({ error: error.details[0].message });

        const balance = await calcBalance(user.id);
        const amount = value.amount * 100;  // convert amount to kobo
        if (balance < amount)
            return res.status(402).json({ error: "Insufficient funds. Please fund your wallet." });

        const deliveryCode = generateDeliveryCode();
        const dispatchNo = await generateDispatchNo();

        const order = new Order({
            ...value,
            amount,
            customer: user.id,
            deliveryCode,
            dispatchNo
        });

        await Transaction.create({
            user: user.id,
            amount,
            type: TRX_TYPE.debit,
            service: TRX_SERVICE.deliveryPayment,
            reference: await generateReference('DLV')
        });

        await order.save();

        sendMail(user.email, 'Order Created', generateCreatedOrderMail(order, user));
        // todo -->> send mail to all riders to notify them of a new order

        return res.status(201).json({ message: "Order created successfully", order });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function getOrders(req: Request, res: Response) {
    const { id, role } = req.user;
    const progressTracker = req.query.progress;

    try {
        let orders;
        const populateFields = 'firstName lastName email phoneNumber';
        if (role === "rider") {
            // get all orders assigned to the rider or yet to be assigned (progressTracker = 0)
            if (Number(progressTracker) > 0) {
                orders = await Order.find({ rider: id, progressTracker })
                    .populate({ path: 'customer', select: populateFields })
                    .sort({ createdAt: -1 })
                    .select('-__v -rider');
            } else if (progressTracker === '0') {
                orders = await Order.find({ progressTracker: 0 })
                    .populate({ path: 'customer', select: populateFields })
                    .sort({ createdAt: -1 })
                    .select('-__v -rider');
            } else {
                orders = await Order.find({ $or: [{ rider: id }, { progressTracker: 0 }] })
                    .populate({ path: 'customer', select: populateFields })
                    .sort({ createdAt: -1 })
                    .select('-__v -rider');
            }
        } else if (role === "customer") {
            orders = await Order.find({ customer: id })
                .populate({ path: 'rider', select: populateFields })
                .sort({ createdAt: -1 }).select('-__v')
                .select('-__v -customer');
        } else {
            orders = await Order.find().sort({ createdAt: -1 })
                .populate({ path: 'customer', select: populateFields })
                .populate({ path: 'rider', select: populateFields })
                .select('-__v');
        }
        return res.json({ result: orders.length, orders });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    const { role } = req.user;
    try {
        let order;
        const populateFields = 'firstName lastName email phoneNumber';
        if (role === "rider") {
            order = await Order.findOne({ _id: orderId, rider: req.user.id })
                .populate({ path: 'customer', select: populateFields })
                .select('-__v');
        } else if (role === "customer") {
            order = await Order.findOne({ _id: orderId, customer: req.user.id })
                .populate({ path: 'rider', select: populateFields })
                .select('-__v');
        } else {
            order = await Order.findById(orderId)
                .populate({ path: 'customer', select: populateFields })
                .populate({ path: 'rider', select: populateFields })
                .select('-__v');
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
        const order = await Order.findOne({ _id: orderId, progressTracker: 0 }).select('-rider -__v -createdAt -updatedAt');
        if (!order)
            return res.status(404).json({ error: "Order not available for acceptance" });

        order.rider = req.user.id;
        order.progressTracker = 1;
        await order.save();

        //todo --> send mail to customer to notify them of the rider assigned to their order

        return res.json({ message: "You have accept to deliver this package", order });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function pickUpDelivery(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ _id: orderId, progressTracker: 1 }).select('-rider -__v -createdAt -updatedAt');
        if (!order)
            return res.status(404).json({ error: "Order not available for pick up" });

        order.progressTracker = 2;
        await order.save();

        return res.json({ message: "You have picked up this package for delivery", order });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function deliverPackage(req: Request, res: Response) {
    const { orderId } = req.params;
    const deliveryCode = req.body.deliveryCode;
    if (!deliveryCode)
        return res.status(400).json({ error: "'deliveryCode' is required" });

    try {
        const order = await Order.findOne({_id: orderId, progressTracker: 2})
            .select('-rider -__v -createdAt -updatedAt')
            .populate({path: 'customer', select: 'email firstName lastName'})
            .populate({path: 'rider', select: 'email firstName lastName'});
        if (!order)
            return res.status(404).json({ error: "Order not available for delivery" });

        if (order.deliveryCode !== deliveryCode)
            return res.status(400).json({ error: "Delivery code is incorrect" });

        order.status = ORDER_STATUS.delivered;
        order.progressTracker = 3;
        order.deliveryCode = '';
        await order.save();

        const customer = order.customer as IUser;
        const rider = order.rider as IRider;

        sendMail(customer.email, 'Your Package Has Been Delivered', generateOrderDeliveryMail(order, customer, rider));
        // todo --> implement dashboard notification logic here

        return res.json({ message: "You have successfully delivered the package", order });
    } catch (error) {
        errorHandler(error, res);
    }
}


/** Fund wallet controller to make delivery payments */
export async function fundWallet(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { reference } = req.body;
        if (!reference)
            return res.status(400).json({ message: "Reference is missing in request body" });

        const processed = await Transaction.findOne({ reference });
        if (processed)
            return res.status(400).json({ message: "Transaction already processed" });

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