import { Router } from "express";
import * as order from "../controllers/orderController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authenticateUser, order.createOrder);
router.get('/', authenticateUser, order.getOrders);
router.get('/:orderId', authenticateUser, order.getOrderById);
router.put('/cancel/:orderId', authenticateUser, order.cancelOrder);
router.put('/confirm/:orderId', authenticateUser, order.confirmOrder);

export default router;