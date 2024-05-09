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

router.post("/users", createUserValidationRules(), validate, createUser);
router.post("/users/login", loginUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", createUserValidationRules(), validate, updateUser);
export default router;
