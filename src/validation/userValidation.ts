import { body } from "express-validator";

export const createUserValidationRules = () => {
  return [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[, @ .])[A-Za-z\d, @ .]+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character (`,`, `@`, `.`)"
      ),
  ];
};
