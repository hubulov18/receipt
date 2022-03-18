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
const telegraf_1 = require("telegraf");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
const user_1 = require("../../repositories/user");
const moment_1 = __importDefault(require("moment"));
const receipt_service_1 = require("../../services/receipt.service");
const UploadReceipt = new telegraf_1.Scenes.BaseScene("upload-receipt");
const receiptService = new receipt_service_1.ReceiptService();
const uploadReceiptKeyboard = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.callback("В меню", "to-main-menu")
]);
UploadReceipt.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(`
Отправь фото чека. 
Доступные комманды: 
    /menu - в меню
    `);
}));
UploadReceipt.action("to-main-menu", (ctx) => {
    ctx.scene.enter("main-menu");
});
UploadReceipt.command("menu", (ctx) => {
    ctx.scene.enter("main-menu");
});
UploadReceipt.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Это текст а не фото. Попробуй еще раз, или /menu");
}));
UploadReceipt.on("photo", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = ctx.from.id;
    const user = yield (0, user_1.getUser)(uid);
    if (!user) {
        return ctx.scene.enter("main-menu");
    }
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const date = (0, moment_1.default)(new Date()).format("YYYY_MM_DD"); //.toISOString().slice(0,10).replace(/-/g,"");
    const filePath = `${config_1.appConfig.uploadsPath}/receipts/${user.id}/${date}/`;
    // @todo think about sync usage in this place
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.mkdirSync(filePath, { recursive: true });
    }
    const imageData = yield ctx.telegram.getFile(photo.file_id);
    if (!imageData.file_path) {
        throw new Error("Could not detect photo extension");
    }
    const extensionAr = imageData.file_path.split(".");
    const extension = extensionAr[extensionAr.length - 1];
    const filename = (Math.random() + 1).toString(36).substring(7);
    const fullpath = `${filePath}${filename}.${extension}`;
    try {
        const receiptFDecodingParams = {
            tgPath: imageData.file_path,
            localPath: fullpath,
            userId: user.id,
            photoId: photo.file_id,
            isTesting: false
        };
        const qrCode = yield receiptService.receiptDecoding(receiptFDecodingParams);
        if (qrCode) {
            ctx.reply(`Чек декодирован: fd${qrCode.fd}, fpd:${qrCode.fpd}, fn:${qrCode.fn}, s:${qrCode.s}, n:${qrCode.n}`);
        }
        else {
            throw new Error("Чек не распознан");
        }
    }
    catch (e) {
        console.log("error: ", e.message);
        yield ctx.reply(`
            Ошибка загрузки qr кода. 
            Доступные комманды:
            /menu - меню
            /help - помощь
            /support - служба поддержки
`);
    }
    return;
}));
exports.default = UploadReceipt;
