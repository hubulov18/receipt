"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/api/user-controller");
const router = express_1.default.Router();
router.get("/", user_controller_1.get);
router.post("/", user_controller_1.store);
module.exports = router;
