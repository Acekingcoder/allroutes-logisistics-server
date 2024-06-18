import { Router } from "express";
import {
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
} from "../controllers/userController";
import { createUserValidationRules } from "../validation/userValidation";
import { validate } from "../middlewares/validationMiddleware";
const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", createUserValidationRules(), validate, updateUser);

export default router;
