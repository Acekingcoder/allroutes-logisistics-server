import { body } from "express-validator";

export const createOrderValidationRules = () => {
  return [
    body("name").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("weight").isNumeric().optional(),
    body("quantity").isNumeric().notEmpty(),
    body("category").isString().notEmpty(),
    body("deliveryAddress.street").isString().notEmpty(),
    body("deliveryAddress.city").isString().notEmpty(),
    body("deliveryAddress.state").isString().notEmpty(),
    body("pickupAddress.street").isString().notEmpty(),
    body("pickupAddress.city").isString().notEmpty(),
    body("pickupAddress.state").isString().notEmpty(),
    body("recipient.name").isString().notEmpty(),
    body("recipient.phoneNumber").isString().notEmpty(),
  ];
};