import { Router } from "express";
import { createRiderProfile } from "../controllers/riderController"
import { validate } from "../middlewares/validationMiddleware";
import { validatingRiderInfo } from "../validation/riderInfoValidation"

const router = Router()

router.post("/signup", validatingRiderInfo(), validate, createRiderProfile)

export default router