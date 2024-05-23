import { body } from "express-validator";

export const validatingRiderInfo = () => {
  return [
    body("fullName").trim()
    .isString().withMessage("Full name must be a string")
    .notEmpty().withMessage("Your full name is required"),
    
    body("email").trim().trim()
    .isEmail().withMessage("Invalid email address"),

    body("phoneNumber").trim()
    .isString().withMessage("phone number must be a string")
    .notEmpty().withMessage("Your phone number is required"),

    body("address").trim()
    .isString().withMessage("address must be a string")
    .notEmpty().withMessage("Your address is required"),

    body("licenseNumber").trim()
    .isString().withMessage("license number must be a string")
    .notEmpty().withMessage("Your license number is required"),

    body("englishFluency").trim()
    .notEmpty().withMessage("Your english fluency level rating is required"),

    body("c1_fullName").trim()
    .isString().withMessage("Contact full name must be a string")
    .notEmpty().withMessage("Contact full name is required"),

    body("c1_relationship").trim()
    .notEmpty().withMessage("Contact relationship status is required"),

    body("c1_phoneNumber").trim()
    .isString().withMessage("Contact phone number must be a string")
    .notEmpty().withMessage("Contact phone number is required"),

    body("c1_address").trim()
    .isString().withMessage("Contact address must be a string")
    .notEmpty().withMessage("Contact address is required"),

    body("c2_fullName").trim()
    .isString().withMessage("Contact full name must be a string")    
    .notEmpty().withMessage("Contact full name is required"),

    body("c2_relationship").trim()
    .notEmpty().withMessage("Contact relationship status is required"),

    body("c2_phoneNumber").trim()
    .isString().withMessage("Contact phone number must be a string")
    .notEmpty().withMessage("Contact phone number is required"),

    body("c2_address").trim()
    .isString().withMessage("Contact address must be a string")
    .notEmpty().withMessage("Contact address is required")
  ];
};