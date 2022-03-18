import express from "express";
import { get } from "../controllers/api/receipt-controller";
const router = express.Router();

router.get("/", get);

export = router;
