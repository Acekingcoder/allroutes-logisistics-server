import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import Notification from "../models/notificationModel";
import { errorHandler } from "../utils/helperFunctions";


export async function getNotification(req: Request, res: Response) {
    try {
        let { userId, filter } = req.params;
        filter = (filter === 'read' || filter === 'unread') ? filter : 'all';
        //checking if the user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        //get all the notifications pertaining to the user
        let searchParams = { user: userId, read: filter === 'read' }
        if(filter != 'all') {
            searchParams = { user: userId } as any
        }
        const notifications = await Notification
        .find(searchParams)
        .sort({ createdAt: -1 })
        return res.json({ result: notifications.length, notifications });

    } catch (error) {
        //error while executing
        errorHandler(error, res)
    }
}

export async function getNotificationById(req: Request, res: Response) {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findOne({ _id: notificationId })
        .select('-__v');
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        return res.json({ notification });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function readNotification(req: Request, res: Response) {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findOne({ _id: notificationId })
        .select('-__v');
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        notification.read = true
        const newNotification = await notification.save();
        res.status(200).json({
            status: "success",
            newNotification,
        });
    } catch (error: any) {
        errorHandler(error, res);
    }
}

export async function create(msg: string, userId: string) {
    try {
        const notification = new Notification({ message: msg, user: userId });
        await notification.save();
    }
    catch (error: any) {
        throw new Error('Error creating notification');
    }
}