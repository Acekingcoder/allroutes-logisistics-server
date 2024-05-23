import { Router } from "express";
import * as order from "../controllers/orderController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authenticateUser, order.createOrder);
router.get('/', authenticateUser, order.getOrders);
router.get('/:orderId', authenticateUser, order.getOrderById);

export default router;