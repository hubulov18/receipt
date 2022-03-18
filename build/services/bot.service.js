"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const https_1 = __importDefault(require("https"));
class BotService {
    // `https://api.telegram.org/bot${token}/setMyCommands`,
    setMyCommands(token, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const options = {
                    hostname: "api.telegram.org",
                    port: 443,
                    path: `/bot${token}/setMyCommands`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        // 'Content-Length': data.length
                    },
                    body: { commands: commands }
                };
                const req = yield https_1.default.request(options, (res) => {
                    res.on("data", (d) => {
                        resolve(d);
                    });
                });
                req.on("error", (error) => {
                    reject(error);
                });
                console.log("setMyCommands");
            }));
            console.log("setMyCommands", result);
        });
    }
}
exports.BotService = BotService;
