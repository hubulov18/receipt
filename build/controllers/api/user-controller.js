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
exports.store = exports.get = void 0;
const validator_1 = __importDefault(require("validator"));
const user_1 = require("../../repositories/user");
const helpers_1 = require("../../utils/helpers");
const get = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = (0, helpers_1.transformFilterQuery)(request);
        const users = yield (0, user_1.getUsersFiltered)(filter);
        response.send(users);
    }
    catch (e) {
        response.status(500).send(e.message);
    }
});
exports.get = get;
const store = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.body.name &&
            validator_1.default.isMobilePhone(`+${request.body.phone}`, "ru-RU")) {
            const id = (Math.random() + 1) * 1000000000;
            const user = {
                id: Math.ceil(id),
                name: String(request.body.name),
                phone: `+${String(request.body.phone)}`
            };
            yield (0, user_1.createUser)(user);
            response.sendStatus(201);
        }
        else
            throw new Error("Input data error");
    }
    catch (e) {
        response.status(500).send(e.message);
    }
});
exports.store = store;
