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
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_1 = require("../../repositories/user");
const receipt_1 = require("../../repositories/receipt");
const enums_1 = require("../../enums");
const ReceiptList = new telegraf_1.Scenes.BaseScene("receipt-list");
const getFnsStatusText = (fnsStatus) => {
    switch (fnsStatus) {
        case enums_1.FnsStatus.NOT_CHECKED:
            return "Не проверен";
        case enums_1.FnsStatus.SUCCESS:
            return "Успешно";
        case enums_1.FnsStatus.ERROR:
            return "Ошибка";
    }
};
const getReceiptStatusText = (receiptStatus) => {
    switch (receiptStatus) {
        case enums_1.ReceiptStatus.HOLD:
            return "Ожидает";
        case enums_1.ReceiptStatus.IN_PROCESS:
            return "В процессе";
        case enums_1.ReceiptStatus.VALID:
            return "Валидный";
        case enums_1.ReceiptStatus.INVALID:
            return "Невалидный";
    }
};
const startReceiptList = (ctx, toStart = true) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = ctx.from.id;
    const user = yield (0, user_1.getUser)(uid);
    if (!user) {
        return ctx.scene.enter("main-menu");
    }
    if (toStart) {
        ctx.session.receiptPage = 1;
    }
    let receipts = yield (0, receipt_1.getReceiptsByUser)(user.id, ctx.session.receiptPage, 1);
    if (!receipts.length) {
        ctx.reply(`
Конец списка.
Доступные комманды: 
  /more - более старые
  /totop - в начало
  /menu - в меню
    `);
    }
    else {
        ctx.session.receiptPage = ctx.session.receiptPage + 1;
        ctx.reply(`
  Загруженные чеки:
  ${receipts.map((el) => {
            return `
      - Чек № ${el.id}. Статус фнс: ${getFnsStatusText(el.fnsStatus)}. Статус чека: ${getReceiptStatusText(el.status)}
  `;
        })}
Доступные комманды: 
  /more - более старые
  /totop - в начало
  /menu - в меню
    `);
    }
    // ctx.session.receiptPage = 1;
    //   ctx.reply(`
    // Загруженные чеки:
    // ${receipts.map((el) => {
    //   return `
    //     - Чек № ${el.id}. Статус фнс: ${getFnsStatusText(
    //     el.fnsStatus
    //   )}. Статус чека: ${getReceiptStatusText(el.status)}
    // `;
    // })}
    // Доступные комманды:
    //     /more - более старые
    //     /totop - в начало
    //     /menu - в меню
    //     `);
});
ReceiptList.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield startReceiptList(ctx);
}));
ReceiptList.command("to-top", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield startReceiptList(ctx);
}));
ReceiptList.command("more", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = ctx.from.id;
    const user = yield (0, user_1.getUser)(uid);
    if (!user) {
        return ctx.scene.enter("main-menu");
    }
    yield startReceiptList(ctx, false);
}));
ReceiptList.command("menu", (ctx) => {
    ctx.scene.enter("main-menu");
});
exports.default = ReceiptList;
