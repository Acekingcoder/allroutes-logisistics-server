import { Router } from "express";
import * as order from "../controllers/orderController";
import { authenticate, authorizeCustomer, authorizeRider } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authenticate, authorizeCustomer, order.createOrder);
router.get('/', authenticate, order.getOrders);
router.get('/:orderId', authenticate, order.getOrderById);
router.put('/:orderId/accept', authenticate, authorizeRider, order.acceptPickupRequest);
router.put('/:orderId/pickup', authenticate, authorizeRider, order.pickUpDelivery);
router.put('/:orderId/deliver', authenticate, authorizeRider, order.deliverPackage);
router.post('/fund-wallet', authenticate, authorizeCustomer, order.fundWallet);
// router.put('/cancel/:orderId', authenticateUser, order.cancelOrder);
// router.put('/confirm/:orderId', authenticateUser, order.confirmOrder);

export default router;