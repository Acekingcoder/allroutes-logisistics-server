import {body} from "express-validator";

export const createItemValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("deliveryAddress.street").notEmpty().withMessage("Delivery street is required"),
    body("deliveryAddress.city").notEmpty().withMessage("Delivery city is required"),
    body("deliveryAddress.state").notEmpty().withMessage("Delivery state is required"),
    body("pickupAddress.street").notEmpty().withMessage("Pickup street is required"),
    body("pickupAddress.city").notEmpty().withMessage("Pickup city is required"),
    body("pickupAddress.state").notEmpty().withMessage("Pickup state is required"),
    body("recipient.name").notEmpty().withMessage("Recipient name is required"),
    body("recipient.phoneNumber").notEmpty().withMessage("Recipient phone number is required"),
  ];
};