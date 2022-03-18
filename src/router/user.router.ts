import express from "express";
import { get, store } from "../controllers/api/user-controller";
const router = express.Router();

router.get("/", get);
router.post("/", store);

export = router;
