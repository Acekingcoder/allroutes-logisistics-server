import { Request, Response } from "express";
import Tx from "../models/txModel"; 
import User from "../models/userModel";
import { randomUUID } from "crypto";

/* new Tx */
export const newTx = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    //verify if parametres were passes
    if(userId && amount) {
        try {
            //check if user is existing
            const existingUser = await User.findById(userId);

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }
            //generate random id
            const id = randomUUID().replace(/[^a-zA-z0-9]/g, "")
            try {
                await Tx.create({
                    userId,
                    amount,
                    ref:id,
                    date:(new Date()).getTime()     
                });
            } catch {
                throw new Error('Tx creation failed 500');
            }
        }
        catch(error:any) {
            //error
            res
            .status(500)
            .json({ message: "Missing parametres", error: error.message });
        }
    }
    else {
        //missing parametres
        res
        .status(500)
        .json({ message: "Missing parametres", error: `userId=${userId} amount=${amount}` });
    }
};
/* verify TX */   
export const verify = async (req: Request, res: Response) => {
    const { ref } = req.body;

    //verify if parametres were passes
    if(ref) {
        try {
          /* code here */
        }
        catch(error:any) {
            //error
            res
            .status(500)
            .json({ message: "Missing parametres", error: error.message });
        }
    }
    else {
        //missing parametres
        res
        .status(500)
        .json({ message: "Missing parametres", error: `ref=${ref}` });
    }
};
/* all Tx by userId*/
export const all = async (req: Request, res: Response) => {
    const { userId } = req.body;

    //verify if parametres were passes
    if(userId) {
        try {
          /* code here */
        }
        catch(error:any) {
            //error
            res
            .status(500)
            .json({ message: "Missing parametres", error: error.message });
        }
    }
    else {
        //missing parametres
        res
        .status(500)
        .json({ message: "Missing parametres", error: `userId=${userId}` });
    }
};
