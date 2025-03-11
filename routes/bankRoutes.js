import express from "express";
import { getBalance, transferMoney, getTransactionHistory } from "../controllers/BankAccount.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/balance", verifyToken, getBalance);
router.post("/transfer", verifyToken, transferMoney);
router.get("/transactions", verifyToken, getTransactionHistory);

export default router