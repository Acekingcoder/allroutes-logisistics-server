import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function verifyTransaction(ref: string) {
    const authorizationHeaders = {headers: {Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`}}
    const url = `https://api.paystack.co/transaction/verify/${ref}`;

    try{
        const response = await axios.get(url, authorizationHeaders);
        return response.data;
    }catch{
        throw new Error("Error verifying transaction")
    }
}