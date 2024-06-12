import { Router } from "express";
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
  loginUser,
} from "../controllers/userController";
import { createUserValidationRules } from "../validation/userValidation";
import { validate } from "../middlewares/validationMiddleware";
const router = Router();

router.post("/", createUserValidationRules(), validate, createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", createUserValidationRules(), validate, updateUser);

export default router;
