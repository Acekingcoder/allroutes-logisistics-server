import { Router } from "express";
import * as user from "../controllers/userController";
import * as admin from '../controllers/admin';
import { createUserValidationRules } from "../validation/userValidation";
import { validate } from "../middlewares/validationMiddleware";
import { authenticateAdmin } from "../middlewares/authMiddleware";
const router = Router();

router.get("/", authenticateAdmin, user.getAllUsers);
router.get("/:userId", authenticateAdmin, user.getUserById);
router.delete("/:userId", authenticateAdmin, user.deleteUserById);
router.put("/:userId", createUserValidationRules(), validate, user.updateUser);

export default router;
