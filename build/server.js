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
const router_1 = __importDefault(require("./router"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
class Server {
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app = (0, express_1.default)();
            this.app.use(body_parser_1.default.json());
            yield this.app.listen(config_1.appConfig.port || 5000);
            this.app.use("/api", router_1.default);
            console.log(`Api server has been started on port ${config_1.appConfig.port}`);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.startServer();
        });
    }
}
exports.default = Server;
