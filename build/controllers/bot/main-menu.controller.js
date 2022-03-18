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
const user_1 = require("../../repositories/user");
const strings_1 = __importDefault(require("../../utils/strings"));
const MainMenu = new telegraf_1.Scenes.BaseScene("main-menu");
MainMenu.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = ctx.from.id;
    const user = yield (0, user_1.getUser)(uid);
    if (!user) {
        const newUser = (0, user_1.createUser)({
            id: uid,
            name: ctx.from.username,
            phone: undefined
        });
    }
    yield ctx.reply(`
Главное меню. 
Доступные комманды:
   /info - информация 
   /upload - загрузка чека
   /list - список загруженных чеков
    `);
}));
MainMenu.command("info", (ctx) => {
    return ctx.reply(strings_1.default.mainMenu.info_text);
});
MainMenu.command("upload", (ctx) => {
    return ctx.scene.enter("upload-receipt");
});
MainMenu.command("list", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.scene.enter("receipt-list");
}));
MainMenu.on("text", (ctx) => {
    return ctx.reply("Ты находишься в главном меню");
});
MainMenu.leave((ctx) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.default = MainMenu;
