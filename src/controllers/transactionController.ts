import { Request, Response } from 'express';
import { errorHandler } from '../middlewares/errorMiddleware';
import Transaction from '../models/transactionModel';
import { verifyTransaction } from '../utils/paystack';

export async function fundWallet(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const { reference } = req.body;

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
            transactionType: "credit",
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