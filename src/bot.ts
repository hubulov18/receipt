import { Context, Scenes, session, Telegraf } from "telegraf";
import { Update } from "typegram";
import { SceneContext, Stage } from "telegraf/typings/scenes";
import MainMenu from "./controllers/bot/main-menu.controller";
import UploadReceipt from "./controllers/bot/upload-receipt.conftoller";
import ReceiptList from "./controllers/bot/receipt--list.controller";
import { BaseJob } from "./jobs/base.job";
import { BotService } from "./services/bot.service";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { ReceiptCheckFns } from "./jobs/receipt-check-fns.job";
import { IWebHookData } from "./interfaces";

/**
 *
 */
export default class Bot {
  private app: Express; // express instance for webhook
  private bot: Telegraf<Context<Update>>; // telegraf bot instance
  private stage: Stage<any>; // telegraf stage
  private crons: BaseJob[]; // cron jobs
  private botService: BotService; //
  private readonly webhookData: IWebHookData | null; // webhook settings

  constructor(token: string, webhookData: IWebHookData | null = null) {
    this.webhookData = webhookData;
    this.bot = new Telegraf(token);
    this.botService = new BotService();
    this.stage = new Scenes.Stage();
    this.stage.register(MainMenu);
    this.stage.register(UploadReceipt);
    this.stage.register(ReceiptList);
    this.bot.use(session());
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
  public async start() {
    if (this.webhookData) {
      await this.startWebhook();
    } else {
      await this.startLongPool();
    }
    console.log("Bot started");
  }

  /**
   * init bot commands
   * @private
   */
  private initCommands() {
    this.bot.start((ctx) => {
      ctx.reply(
        "Привет " +
          ctx.from.first_name +
          "! Я бот для проверки чеков. Вводи /help для просмотра комманд."
      );
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
      (ctx as SceneContext).scene.enter("main-menu");
    });
    this.bot.command("upload", (ctx) => {
      (ctx as SceneContext).scene.enter("upload-receipt");
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
  private async startLongPool(): Promise<void> {
    await this.bot.launch();
  }

  /**
   * Start bot via "webhook"
   * @todo
   * @private
   */
  private async startWebhook() {
    if (!this.webhookData) {
      throw Error("Could not start webhook. bot.webhookData is null");
    }
    // Set telegram webhook
    await this.bot.telegram.setWebhook(
      `${this.webhookData.url}/${this.webhookData.webhook}`
    );

    // dont work
    // await this.bot.launch({
    //     webhook: {
    //         domain: this.webhookData?.url,
    //         hookPath: this.webhookData.webhook,
    //         port: 3000
    //     }
    // });

    this.app = express();
    this.app.use(bodyParser.json());
    // Set the bot API endpoint
    this.app.use(this.bot.webhookCallback(this.webhookData?.webhook));

    // dont work
    // await this.app.post(this.webhookData.webhook, (req, res) => {
    //     console.log(req.body);
    //     return this.bot.handleUpdate(req.body, res);
    // });

    this.app.listen(this.webhookData.port, () => {
      console.log("Example app listening on port 3000!");
    });
  }

  /**
   * Init background jobs
   * @private
   */
  private initJobs() {
    this.crons = [
      new ReceiptCheckFns()
      // ...
    ];
  }

  /**
   * Start background jobs
   * @private
   */
  private startJobs() {
    for (let job of this.crons) {
      job.launch();
    }
  }
}
