"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const receipt_controller_1 = require("../controllers/api/receipt-controller");
const router = express_1.default.Router();
router.get("/", receipt_controller_1.get);
module.exports = router;
