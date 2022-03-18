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
exports.ReceiptCheckFns = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const base_job_1 = require("./base.job");
const receipt_1 = require("../repositories/receipt");
const fns_service_1 = require("../services/fns.service");
/**
 * ReceiptCheckFns
 * Отправка чеков в фнс для проверки
 */
class ReceiptCheckFns extends base_job_1.BaseJob {
    constructor() {
        super();
        this.fnsService = new fns_service_1.FnsService();
    }
    launch() {
        this.task = node_cron_1.default.schedule("* */50 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("receipt-check-fns job started");
            const receipts = yield (0, receipt_1.getReceiptsForReadQr)();
            let data = {};
            for (let r of receipts) {
                data = yield this.fnsService.send(r.getQrCodeObject());
                let result = {
                    code: data.code,
                    data: data.data,
                    message: data.message
                };
                yield this.fnsService.saveFnsResult(result, r.id);
            }
        }));
    }
}
exports.ReceiptCheckFns = ReceiptCheckFns;
