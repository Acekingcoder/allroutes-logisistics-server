import { Router } from "express";
import { all, newTx, verify } from "../controllers/txController"; 
const router = Router();

router.post("/", newTx);
router.post("/verify", verify);
router.get("/all", all); 

export default router;
