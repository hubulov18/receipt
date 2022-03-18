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
const main_menu_controller_1 = __importDefault(require("./controllers/bot/main-menu.controller"));
const upload_receipt_conftoller_1 = __importDefault(require("./controllers/bot/upload-receipt.conftoller"));
const receipt__list_controller_1 = __importDefault(require("./controllers/bot/receipt--list.controller"));
const bot_service_1 = require("./services/bot.service");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const receipt_check_fns_job_1 = require("./jobs/receipt-check-fns.job");
/**
 *
 */
class Bot {
    constructor(token, webhookData = null) {
        this.webhookData = webhookData;
        this.bot = new telegraf_1.Telegraf(token);
        this.botService = new bot_service_1.BotService();
        this.stage = new telegraf_1.Scenes.Stage();
        this.stage.register(main_menu_controller_1.default);
        this.stage.register(upload_receipt_conftoller_1.default);
        this.stage.register(receipt__list_controller_1.default);
        this.bot.use((0, telegraf_1.session)());
        this.bot.use(this.stage.middleware());
        // this.botService.setMyCommands(appConfig.token, [
        //     {command: 'start', description: 'Приветственное сообщение'},
        //     {command: 'menu', description: 'Меню'},
        //     {command: 'upload', description: 'Загрузка чека'},
        //     {command: 'quit', description: 'Выход из бота'},
        // ]).then(() => {
        //     console.log('commands menu was set');
        // });
        this.initCommands();
        this.initJobs();
        this.startJobs();
        // Enable graceful stop
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    }
    /**
     * Method to starts bot
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.webhookData) {
                yield this.startWebhook();
            }
            else {
                yield this.startLongPool();
            }
            console.log("Bot started");
        });
    }
    /**
     * init bot commands
     * @private
     */
    initCommands() {
        this.bot.start((ctx) => {
            ctx.reply("Привет " +
                ctx.from.first_name +
                "! Я бот для проверки чеков. Вводи /help для просмотра комманд.");
        });
        this.bot.help((ctx) => {
            ctx.reply("/start - приветственное сообщение");
            ctx.reply("/menu - вызов меню");
            ctx.reply("/upload - загрузить чек");
            // ctx.reply('/list - список загруженных чеков');
            // ctx.reply('/keyboard to receive a message with a keyboard');
            ctx.reply("/quit - выход из бота");
        });
        this.bot.command("menu", (ctx) => {
            ctx.scene.enter("main-menu");
        });
        this.bot.command("upload", (ctx) => {
            ctx.scene.enter("upload-receipt");
        });
        this.bot.command("quit", (ctx) => {
            // Explicit usage
            ctx.telegram.leaveChat(ctx.message.chat.id);
            // Context shortcut
            ctx.leaveChat();
        });
        // this.bot.command('upload', (ctx) => {
        //     ctx.reply('В разработке');
        // });
        // this.bot.command('list', (ctx) => {
        //     ctx.reply('В разработке');
        // });
    }
    /**
     * Start bot via "long pool"
     * @private
     */
    startLongPool() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.launch();
        });
    }
    /**
     * Start bot via "webhook"
     * @todo
     * @private
     */
    startWebhook() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.webhookData) {
                throw Error("Could not start webhook. bot.webhookData is null");
            }
            // Set telegram webhook
            yield this.bot.telegram.setWebhook(`${this.webhookData.url}/${this.webhookData.webhook}`);
            // dont work
            // await this.bot.launch({
            //     webhook: {
            //         domain: this.webhookData?.url,
            //         hookPath: this.webhookData.webhook,
            //         port: 3000
            //     }
            // });
            this.app = (0, express_1.default)();
            this.app.use(body_parser_1.default.json());
            // Set the bot API endpoint
            this.app.use(this.bot.webhookCallback((_a = this.webhookData) === null || _a === void 0 ? void 0 : _a.webhook));
            // dont work
            // await this.app.post(this.webhookData.webhook, (req, res) => {
            //     console.log(req.body);
            //     return this.bot.handleUpdate(req.body, res);
            // });
            this.app.listen(this.webhookData.port, () => {
                console.log("Example app listening on port 3000!");
            });
        });
    }
    /**
     * Init background jobs
     * @private
     */
    initJobs() {
        this.crons = [
            new receipt_check_fns_job_1.ReceiptCheckFns()
            // ...
        ];
    }
    /**
     * Start background jobs
     * @private
     */
    startJobs() {
        for (let job of this.crons) {
            job.launch();
        }
    }
}
exports.default = Bot;
