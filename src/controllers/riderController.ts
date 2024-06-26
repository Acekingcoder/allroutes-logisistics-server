import { Request, Response } from "express";
import Rider from "../models/ridersModel";
import { errorHandler, passwordCheck } from "../utils/helperFunctions";
import bcrypt from "bcryptjs";
import * as joi from "../validation/joi";
import User from '../models/userModel';
import { attachToken, signToken } from "../utils/jwt";


export async function loginRider(req: Request, res: Response) {
    try {
        const { error, value } = joi.loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
        const rider = await Rider.findOne({ email: value.email });
        if (!rider) return res.status(401).json({ message: "Invalid credentials!" });

        const isValid = await bcrypt.compare(value.password, rider.password as string);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials!" });

        const token = signToken(rider);
        attachToken(token, res);

        const { _id: id, firstName, lastName, phoneNumber, email, role } = rider;
        return res.json({ message: 'Login successful', token, user: { id, firstName, lastName, phoneNumber, email, role } });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export async function createRiderProfile(req: Request, res: Response) {
    try {
        const { error, value } = joi.createRiderSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.message });

        if (await User.findOne({ email: value.email }) || await Rider.findOne({ email: value.email }))
            return res.status(409).json({ message: "Email has been used" });

        if (await Rider.findOne({ phoneNumber: value.phoneNumber }))
            return res.status(409).json({ message: "Phone number has been used" });

        const result = passwordCheck(value.password);
        if (result.error)
            return res.status(400).json({ message: result.error });
        const newRider = await Rider.create({ ...value, password: await bcrypt.hash(value.password, 10) });

        res.status(201).json({ status: "success", newRider });
    } catch (error) {
        errorHandler(error, res);
    }
    // try {

    //     const {
    //         fullName,
    //         email,
    //         phoneNumber,
    //         address,
    //         licenseNumber,
    //         englishFluency,
    //         c1_fullName,
    //         c1_relationship,
    //         c1_phoneNumber,
    //         c1_address,
    //         c2_fullName,
    //         c2_relationship,
    //         c2_phoneNumber,
    //         c2_address
    //     } = req.body;

    //     const findingIfRiderIsExisting = await riderModel.find({ phoneNumber })

    //     if (findingIfRiderIsExisting.length > 0) {
    //         res.status(500).json({
    //             message: `You have an already exisiting account with the phone number - ${phoneNumber}`
    //         })
    //     } else {

    //         const guarantor_details = {
    //             contact1: {
    //                 c1_fullName,
    //                 c1_relationship,
    //                 c1_phoneNumber,
    //                 c1_address
    //             },
    //             contact2: {
    //                 c2_fullName,
    //                 c2_relationship,
    //                 c2_phoneNumber,
    //                 c2_address
    //             },
    //         }

    //         const newRider = await riderModel.create({
    //             fullName,
    //             email,
    //             phoneNumber,
    //             address,
    //             licenseNumber,
    //             englishFluency,
    //             guarantor: guarantor_details
    //         })

    //         if (newRider) {
    //             res.status(200).json({
    //                 message: `Your account is being reviewed. You will be sent an email shortly.`
    //             })

    //         } else {
    //             res.status(500).json({
    //                 message: `Failed to create rider profile. Please try again after few minutes.`
    //             })
    //         }
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return res
    //         .status(500)
    //         .json({ message: "Internal Server Error: creating rider profile" });
    // }
}