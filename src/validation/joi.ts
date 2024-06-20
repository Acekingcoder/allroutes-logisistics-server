import joi from "joi";

export const options = {
    abortEarly: false,
    errors: { wrap: { label: "" } },
};

export const createOrderSchema = joi.object().keys({
    description: joi.string().required().max(1000),
    weight: joi.number(),
    specialInstruction: joi.string().required().max(1000),
    category: joi.string(),
    deliveryAddress: joi.object().keys({
        street: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        coordinates: joi.object().keys({
            lat: joi.number(),
            lng: joi.number(),
        }),
    }),
    pickupAddress: joi.object().keys({
        street: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        coordinates: joi.object().keys({
            lat: joi.number(),
            lng: joi.number(),
        }),
    }),
    pickupDate: joi.date(),
    deliveryDate: joi.date(),
    recipient: joi.object().keys({
        name: joi.string().required(),
        phone: joi.string().required(),
    })
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
