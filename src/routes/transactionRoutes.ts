import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {fundWallet} from "../controllers/transactionController";

const router = Router();

router.post("/fund-wallet", authenticateUser, fundWallet)


export default router;