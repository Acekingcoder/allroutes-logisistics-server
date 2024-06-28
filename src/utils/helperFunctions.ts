
// HELPER FUNCTIONS FILE TO HANDLE BASIC UTILITIES

import { Response } from "express";
import Transaction from "../models/transactionModel";
import { TRX_TYPE } from "./constants";
import Order from '../models/orderModel';
import User from '../models/userModel';
import Rider from '../models/ridersModel';
import Admin from '../models/admin';

/** User password validator */
export function passwordCheck(password: string) {
    if (!/[a-z]/.test(password)) {
        return { error: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { error: "Password must contain at least one number" };
    }
    // Check for consecutive numbers or letters
    if (/(\d)\1{2,}/.test(password) || /([a-zA-Z])\1{2,}/.test(password)) {
        return { error: "Password must not contain consecutive numbers or letters" };
    }
    // Check for consecutive sequences of numbers
    if (/(012|123|234|345|456|567|678|789|890)/.test(password)) {
        return { error: "Password must not contain consecutive sequences of numbers" };
    }
    // Check for consecutive sequences of characters
    if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(password.toLowerCase())) {
        return { error: "Password must not contain consecutive sequences of characters" };
    }
    return { valid: true };
}

/**Generate 4-digits delivery code */
export function generateDeliveryCode() {
    return String(getRandomInt(1_000, 10_000));
}

/**Generate 8-digits order dispatch number */
export async function generateDispatchNo() {
    const generate = () => String(getRandomInt(10_000_000, 100_000_000));
    let dispatchNo = generate();
    let order = await Order.findOne({ dispatchNo });
    while (order) {
        dispatchNo = generate();
        order = await Order.findOne({ dispatchNo });
    }
    return dispatchNo;
}

/** Returns internal server error message with status code 500 */
export function errorHandler(error: any, res: Response) {
    devLog(error.message);
    res.status(500).json({ error: "Internal Server Error!" });
}

/** Log messages only in development mode */
export function devLog(message: unknown) {
    if (process.env.NODE_ENV !== "prod") {
        console.log(message);
    }
}


/**Calculate user wallet balance */
export async function calcBalance(user: string) {
    try {
        const transactions = await Transaction.find({ user });
        const balance = transactions.reduce((acc, curr) => {
            if (curr.type === TRX_TYPE.credit)
                return acc + curr.amount;
            else
                return acc - curr.amount;
        }, 0);
        return balance;
    } catch (error) {
        throw new Error("Error getting balance");
    }
}

/**Generate reference for a transaction e.g delivery payment */
export async function generateReference(prefix: string) {
    const generate = () => String(getRandomInt(1_000_000_000, 10_000_000_000));
    let ref = generate();
    let trx = await Transaction.findOne({ reference: prefix + ref });
    while (trx) {
        ref = generate();
        trx = await Transaction.findOne({ reference: prefix + ref });
    }
    return prefix + ref;
}

/**Return a random integer between two min (inclusive) and max (exclusive) */
function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
