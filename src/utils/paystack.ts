import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function verifyTransaction(ref: string) {
    const authorizationHeaders = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
    const url = `https://api.paystack.co/transaction/verify/${ref}`;

    try {
        const response = await axios.get(url, authorizationHeaders);
        return response.data;
    } catch (error: any) {
        return { status: false }
    }
}