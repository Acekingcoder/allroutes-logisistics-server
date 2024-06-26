import nodemailer from 'nodemailer';
import { devLog } from './helperFunctions';
import { IOrder } from '../models/orderModel';
import { IUser } from '../models/userModel';
import { IRider } from '../models/ridersModel';

export default async function sendMail(to: string, subject: string, text: string) {
    const user = process.env.GMAIL;
    const pass = process.env.GMAIL_PASSWORD;
    const host = process.env.GMAIL_HOST;
    const port = Number(process.env.GMAIL_PORT);

    const transporter = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass } });
    const mailOptions = { from: user, to, subject, html: text };

    try {
        const info = await transporter.sendMail(mailOptions);
        devLog("Email sent: " + info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const getPasswordResetHTML = (firstName: string, otp: string) => `
    <div style="font-family: Arial, Helvetica, sans-serif;">
        <header>
            <img src="https://res.cloudinary.com/dsgqulmnp/image/upload/v1718721138/Screen_Shot_2024-06-18_at_3.29.21_PM_vcng25.png" alt="Allroutes logo" width="200">
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${firstName},</p>
            <p>To reset your AllRoutes account password, please use the following code for verification</p>
            <p style="background-color: rgb(29, 68, 24); color: white; padding: 10px; margin: 20px 0; width: 150px; text-align: center; font-weight: 700; border-radius: 20px; letter-spacing: 4px;">${otp}</p>
            <p>This code expires in 30 minutes.</p>
        </main>
        <footer style="color:rgb(64, 81, 60)">
            <p>© AllRoutes Logistics. All Rights Reserved</p>
        </footer>
    </div>
`

export const generateCreatedOrderMail = (order: IOrder, user: IUser) => `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: white;">
        <header>
            <img src="https://res.cloudinary.com/dsgqulmnp/image/upload/v1718721138/Screen_Shot_2024-06-18_at_3.29.21_PM_vcng25.png" alt="Allroutes logo" width="200">
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${user.firstName},</p>
            <p>Your order has been successfully created.</p>
            <p>Order details:</p>
            <ul>
                <li>Pickup location: ${order.pickupLocation}</li>
                <li>Destination: ${order.destination}</li>
                <li>Amount: ${order.amount/100}NGN</li>
            </ul>
            <p>Order status: ${order.status}</p>
            <p>Order dispatch number: #${order.dispatchNo}</p>
            <p>Delivery code: ${order.deliveryCode}</p>
        </main>
        <footer style="color:rgb(64, 81, 60)">
            <p>© AllRoutes Logistics. All Rights Reserved</p>
        </footer>
    </div>
`

export const generateOrderDeliveryMail = (order: IOrder, user: IUser, rider: IRider) => `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: white;">
        <header>
            <img src="https://res.cloudinary.com/dsgqulmnp/image/upload/v1718721138/Screen_Shot_2024-06-18_at_3.29.21_PM_vcng25.png" alt="Allroutes logo" width="200">
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${user.firstName},</p>
            <p>Your order has been successfully delivered.</p>
            <p>Order details:</p>
            <ul>
                <li>Pickup location: ${order.pickupLocation}</li>
                <li>Destination: ${order.destination}</li>
                <li>Amount: ${order.amount/100}NGN</li>
            </ul>
            <p>Order status: ${order.status}</p>
            <p>Order dispatch number: #${order.dispatchNo}</p>
            <p>Delivered by: ${rider.firstName}</p>
            <p>Thank you for using AllRoutes Logistics.</p>
        </main>
        <footer style="color:rgb(64, 81, 60)">
            <p>© AllRoutes Logistics. All Rights Reserved</p>
        </footer>
    </div>
`
