import { Router } from "express";
import { getNotification, getNotificationById, readNotification } from "../controllers/notificationController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router()

router.get("/:userId", getNotification)
router.get("/:notificationId", getNotificationById)
router.put("/:notificationId/read", authenticate, readNotification)


export default router