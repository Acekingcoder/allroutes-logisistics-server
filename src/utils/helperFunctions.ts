
// HELPER FUNCTIONS FILE TO HANDLE BASIC UTILITIES

import { Response } from "express";
import User from "../models/userModel";
import Transaction from "../models/transactionModel";
import { TRX_TYPE } from "./constants";

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

/**Generate delivery code */
export async function generateDeliveryCode() {
    const generate = () => {
        const characters = '0123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };
    let code = generate();
    let user = await User.findOne({ deliveryCode: code });
    while (user) {
        code = generate();
        user = await User.findOne({ deliveryCode: code });
    }
    return code;
}

export async function generateDispatchNo() {
    const generate = () => {
        const characters = '0123456789';
        let code = '';
        for (let i = 0; i < 7; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };
    let code = generate();
    let user = await User.findOne({ dispatchNo: code });
    while (user) {
        code = generate();
        user = await User.findOne({ dispatchNo: code });
    }
    return code;
}

/** Returns internal server error message with status code 500 */
export function errorHandler(error: any, res: Response) {
    devLog(error.message);
    res.status(500).json({ error: "Internal Server Error!" });
}

/** Log messages only in development mode */
export function devLog(message: unknown) {
    if (process.env.NODE_ENV !== "production") {
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

/**Generate reference for a transaction e.g wallet funding and delivery payment */
export async function generateReference(prefix: string) {
    let ref = Math.floor(Math.random() * 10000000000);
    let trx = await Transaction.findOne({ reference: prefix + ref });
    while (trx) {
        ref = Math.floor(Math.random() * 10000000000);
        trx = await Transaction.findOne({ reference: prefix + ref });
    }
    return prefix + ref;
}