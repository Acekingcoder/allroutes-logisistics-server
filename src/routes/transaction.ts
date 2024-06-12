import { Router } from "express";
import {fundWallet} from "../controllers/transactionController";

const router = Router();

router.post("/fund-wallet", fundWallet)


export default router;