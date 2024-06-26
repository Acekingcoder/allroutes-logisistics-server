import { Router } from "express";
import * as user from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();
router.get("/", authenticate, authorizeAdmin, user.getAllUsers);
router.get('/profile', authenticate, user.getProfile);
router.get("/:userId", authenticate, authorizeAdmin, user.getUserById);
router.delete("/:userId", authenticate, authorizeAdmin, user.deleteUserById);

// router.put("/:userId", createUserValidationRules(), validate, user.updateUser);

export default router;
