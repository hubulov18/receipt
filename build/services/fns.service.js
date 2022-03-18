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
exports.FnsService = void 0;
const https_1 = __importDefault(require("https"));
const config_1 = require("../config");
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const enums_1 = require("../enums");
const good_1 = require("../repositories/good");
/**
 *
 */
class FnsService {
    send(qrCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = this.getQueryStr(qrCode);
            const url = `${config_1.fnsConfig.url}/?${queryString}`;
            return yield this.request(url);
        });
    }
    request(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                let body = [];
                const request = https_1.default.get(url, function (res) {
                    res.on("data", (chunk) => body.push(chunk));
                    res.on("end", () => {
                        const data = Buffer.concat(body).toString();
                        resolve(JSON.parse(data));
                    });
                });
                request.on("error", (e) => {
                    console.log(`ERROR httpsGet: ${e}`);
                    reject(e);
                });
                request.end();
            });
        });
    }
    getQueryStr(qrCode) {
        // qrCode.boughtAt=new Date(qrCode.boughtAt.getTime()+3*60*60*1000)
        return `fn=${qrCode.fn}&fp=${qrCode.fpd}&i=${qrCode.fd}&t=${qrCode.boughtAt
            .toISOString()
            .slice(0, 19)}&s=${qrCode.s * 100}&n=${qrCode.n}`;
    }
    saveFnsResult(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let Incorrect = [400, 406, 452, 528, 453, 454];
            let NotFound = [404, 455];
            const receipt = yield (0, typeorm_1.getRepository)(models_1.Receipt);
            if (Incorrect.includes(payload.code)) {
                yield receipt
                    .createQueryBuilder("receipt")
                    .update(models_1.Receipt)
                    .set({
                    fnsStatus: enums_1.FnsStatus.ERROR,
                    status: enums_1.ReceiptStatus.INVALID,
                    checkErrorCode: payload.code,
                    checkErrorText: payload.message,
                    lastCheck: new Date(Date.now())
                })
                    .where("receipt.id = :id", { id })
                    .execute();
            }
            if (payload.code === 200) {
                const receiptOne = yield (0, typeorm_1.getRepository)(models_1.Receipt).findOne({ id });
                for (let i = 0; i < payload.data.content.items.length; i++) {
                    const good = {
                        price: payload.data.content.items[i].price,
                        quantity: payload.data.content.items[i].quantity,
                        name: payload.data.content.items[i].name,
                        sum: payload.data.content.items[i].sum,
                        createdAt: (payload.data.content.items[i].createdAt = new Date(Date.now())),
                        updatedAt: (payload.data.content.items[i].updatedAt = new Date(Date.now())),
                        receipt: receiptOne
                    };
                    yield (0, good_1.storeGood)(good);
                }
                yield receipt
                    .createQueryBuilder("receipt")
                    .update(models_1.Receipt)
                    .set({
                    fnsStatus: enums_1.FnsStatus.SUCCESS,
                    status: enums_1.ReceiptStatus.VALID,
                    inn: payload.data.content.userInn,
                    marketName: payload.data.content.retailPlace,
                    address: payload.data.address,
                    lastCheck: new Date(Date.now())
                })
                    .where("receipt.id = :id", { id })
                    .execute();
            }
            if (NotFound.includes(payload.code)) {
                yield receipt
                    .createQueryBuilder("receipt")
                    .update(models_1.Receipt)
                    .set({
                    fnsStatus: enums_1.FnsStatus.NOT_CHECKED,
                    checkErrorCode: payload.code,
                    checkErrorText: payload.message,
                    lastCheck: new Date(Date.now())
                })
                    .where("receipt.id = :id", { id })
                    .execute();
            }
        });
    }
}
exports.FnsService = FnsService;
