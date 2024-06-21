import { Request, Response } from "express";
import riderModel from "../models/ridersModel";

export const createRiderProfile = async (req: Request, res: Response) => {
    try {

        const {
            fullName,
            email,
            phoneNumber,
            address,
            licenseNumber,
            englishFluency,
            c1_fullName,
            c1_relationship,
            c1_phoneNumber,
            c1_address,
            c2_fullName,
            c2_relationship,
            c2_phoneNumber,
            c2_address
        } = req.body;

        const findingIfRiderIsExisting = await riderModel.find({ phoneNumber })

        if (findingIfRiderIsExisting.length > 0) {
            res.status(500).json({
                message: `You have an already exisiting account with the phone number - ${phoneNumber}`
            })
        } else {

            const guarantor_details = {
                contact1: {
                    c1_fullName,
                    c1_relationship,
                    c1_phoneNumber,
                    c1_address
                },
                contact2: {
                    c2_fullName,
                    c2_relationship,
                    c2_phoneNumber,
                    c2_address
                },
            }

            const newRider = await riderModel.create({
                fullName,
                email,
                phoneNumber,
                address,
                licenseNumber,
                englishFluency,
                guarantor: guarantor_details
            })

            if (newRider) {
                res.status(200).json({
                    message: `Your account is being reviewed. You will be sent an email shortly.`
                })

            } else {
                res.status(500).json({
                    message: `Failed to create rider profile. Please try again after few minutes.`
                })
            }
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error: creating rider profile" });
    }
};










