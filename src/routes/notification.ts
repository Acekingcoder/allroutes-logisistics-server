import { Router } from "express";
import { getMyNotifications, getMyNotificationById, readNotification } from "../controllers/notificationController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router()

router.get("/", authenticate, getMyNotifications);
router.get("/:notificationId", authenticate, getMyNotificationById);
router.put("/:notificationId/read", authenticate, readNotification);


export default router