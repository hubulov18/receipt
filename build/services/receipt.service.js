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
exports.ReceiptService = void 0;
const files_1 = require("../utils/files");
const jimp_1 = __importDefault(require("jimp"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const https_1 = __importDefault(require("https"));
const receipt_1 = require("../repositories/receipt");
const QrCode = require("qrcode-reader");
/**
 * @todo: для чтения qr возможно сделать отдельные сервис
 *
 */
class ReceiptService {
    /**
     *
     * @param receipt
     * @private
     */
    readQrCode(receipt) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrCodeStr = yield this.readQr(receipt);
            let qrCode = null;
            if (qrCodeStr) {
                qrCode = this.parseQr(qrCodeStr);
            }
            return qrCode;
        });
    }
    /**
     *
     * @param code
     * @private
     */
    parseQr(code) {
        let query = code.split("&").map((el) => el.split("="));
        let queryMap = {};
        for (let elem of query) {
            queryMap[elem[0]] = elem[1];
        }
        let qrCode = {
            fd: queryMap.i,
            fn: queryMap.fn,
            fpd: queryMap.fp,
            s: Number(queryMap.s),
            n: Number(queryMap.n),
            boughtAt: (0, moment_1.default)(queryMap.t).toDate()
        };
        return qrCode;
    }
    /**
     *
     * @param receipt
     * @private
     */
    readQr(receipt) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield (0, files_1.readFile)(receipt.photo.fullpath);
            try {
                let code = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const image = yield jimp_1.default.read(buffer);
                        let qr = new QrCode();
                        qr.callback = function (err, value) {
                            if (err) {
                                reject(err);
                            }
                            if (value && value.result) {
                                resolve(value.result);
                            }
                            else {
                                reject("Не смог распознать qr код");
                            }
                        };
                        qr.decode(image.bitmap);
                    }
                    catch (e) {
                        reject(e.message);
                    }
                }));
                return code;
            }
            catch (e) {
                return null;
            }
        });
    }
    /**
     * Decode receipt qrcode by photo to get info
     * @param data
     */
    receiptDecoding(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const extensionAr = data.tgPath.split(".");
            const extension = extensionAr[extensionAr.length - 1];
            const filename = (Math.random() + 1).toString(10).substring(7);
            const fullPath = `${data.localPath}${filename}.${extension}`;
            const url = `https://api.telegram.org/file/bot${config_1.appConfig.token}/${data.tgPath}`;
            const filestream = fs_1.default.createWriteStream(fullPath);
            const promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // //https://api.telegram.org/bot<token>/getfile?file_id={the file_id of the photo you want to download}
                const request = https_1.default.get(url, function (response) {
                    response.pipe(filestream);
                });
                filestream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                    const receipt = yield (0, receipt_1.storeReceipt)({
                        userId: data.userId,
                        photo: {
                            id: data.photoId,
                            filename: filename,
                            fullpath: fullPath,
                            extension: extension
                        }
                    });
                    let qrCode = null;
                    if (receipt) {
                        qrCode = yield this.readQrCode(receipt); //.catch(async (e) => {});
                        if (qrCode) {
                            yield (0, receipt_1.updateQrCodeInfo)(qrCode, filename);
                            resolve(qrCode);
                        }
                        else {
                            yield (0, receipt_1.deleteReceipt)(receipt.id);
                            reject("Error read qr");
                        }
                    }
                }));
                yield request;
            }));
            return yield promise;
        });
    }
}
exports.ReceiptService = ReceiptService;
