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
const typeorm_1 = require("typeorm");
const config_1 = require("./config");
const bot_1 = __importDefault(require("./bot"));
const server_1 = __importDefault(require("./server"));
/**
 * Application entrypoint
 * @param dbConfig
 */
const main = (dbConfig) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.createConnection)(dbConfig); // connect to database
    yield Promise.all([new bot_1.default(config_1.appConfig.token).start(), new server_1.default().start()]); // start bot && api
});
// Run application
main(config_1.testDatabaseConfig)
    .then(() => console.log("Application started!"))
    .catch((err) => {
    console.log("Error on start application!", err);
    process.exit(1);
});
