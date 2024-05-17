import { Router } from "express";
import * as order from "../controllers/orderController";
import { createOrderValidationRules } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authenticateUser, createOrderValidationRules(), validate, order.createOrder);

export default router;