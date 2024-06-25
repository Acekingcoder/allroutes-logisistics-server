import joi from "joi";

export const options = {
    abortEarly: false,
    errors: { wrap: { label: "" } },
};

export const createOrderSchema = joi.object().keys({
    description: joi.string().max(1000),
    deliveryAddress: joi.string().required(),
    pickupAddress: joi.string().required(),
    amount: joi.number().min(0).required()
});

export const createUserSchema = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phoneNumber: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirm: joi.string().valid(joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

export const userLoginSchema = joi.object().keys({
    email: joi.string().email().required().trim(),
    password: joi.string().required(),
});

export const forgotPasswordSchema = joi.object().keys({
    email: joi.string().email().required().trim()
});

export const resetPasswordSchema = joi.object().keys({
    newPassword: joi.string().min(6).required(),
    confirm: joi.string().valid(joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match' }),
    otp: joi.string().required()
});

export const createAdminSchema = joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

// add more validators here
