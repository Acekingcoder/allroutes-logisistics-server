import Admin from '../models/admin';
import User from '../models/userModel';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as joi from '../validation/joi';
import { generateToken, attachToken } from '../utils/jwt';

// create admin
export async function create(req: Request, res: Response) {
    try {
        const { error, value } = joi.createAdminSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
        let admin = await Admin.findOne({ email: value.email });
        if (admin) return res.status(409).json({ error: "Email has been used" });
        admin = await Admin.create({ ...value, password: await bcrypt.hash(value.password, 10) });
        res.status(201).json({ message: "New admin user created successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Failed to create admin" });
    }
}

// login admin
export async function login(req: Request, res: Response) {
    try {
        const { error, value } = joi.userLoginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
        const admin = await Admin.findOne({ email: value.email });
        if (!admin) return res.status(401).json({ error: "Invalid admin credentials!" });

        const isValid = await bcrypt.compare(value.password, admin.password as string);
        if (!isValid) return res.status(401).json({ error: "Invalid admin credentials!" });

        const token = generateToken(admin);
        attachToken(token, res);

        return res.json({ message: 'Admin login successful', admin: admin.email });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Failed to login admin" });
    }
}

export async function getAll(req: Request, res: Response) {
    try {
        const admins = await Admin.find().select('email');
        return res.json({ admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to login admin" });
    }
}

// delete admin

