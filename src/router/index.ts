import express from "express";
import userRouter from "./user.router";
import receiptRouter from "./receipt.router";
const router = express.Router();

router.use("/users", userRouter);
router.use("/receipts", receiptRouter);

export = router;
