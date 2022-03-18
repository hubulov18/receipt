"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("./user.router"));
const receipt_router_1 = __importDefault(require("./receipt.router"));
const router = express_1.default.Router();
router.use("/users", user_router_1.default);
router.use("/receipts", receipt_router_1.default);
module.exports = router;
