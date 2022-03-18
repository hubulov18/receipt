import { Markup, Scenes } from "telegraf";
import fs from "fs";
import { appConfig } from "../../config";
import { getUser } from "../../repositories/user";
import moment from "moment";
import { IQrCode, IReceiptDecodingParams } from "../../interfaces";
import { ReceiptService } from "../../services/receipt.service";
import { PhotoSize } from "typegram/message";
import { SceneContext } from "telegraf/typings/scenes";

const UploadReceipt = new Scenes.BaseScene("upload-receipt");
const receiptService = new ReceiptService();

const uploadReceiptKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("В меню", "to-main-menu")
]);

UploadReceipt.enter(async (ctx: any) => {
  await ctx.reply(`
Отправь фото чека. 
Доступные комманды: 
    /menu - в меню
    `);
});

UploadReceipt.action("to-main-menu", (ctx: any) => {
  ctx.scene.enter("main-menu");
});

UploadReceipt.command("menu", (ctx) => {
  (ctx as SceneContext).scene.enter("main-menu");
});

UploadReceipt.on("text", async (ctx) => {
  await ctx.reply("Это текст а не фото. Попробуй еще раз, или /menu");
});

UploadReceipt.on("photo", async (ctx) => {
  const uid = ctx.from.id as number;
  const user = await getUser(uid);
  if (!user) {
    return (ctx as SceneContext).scene.enter("main-menu");
  }

  const photo: PhotoSize = ctx.message.photo[ctx.message.photo.length - 1];
  const date = moment(new Date()).format("YYYY_MM_DD"); //.toISOString().slice(0,10).replace(/-/g,"");
  const filePath = `${appConfig.uploadsPath}/receipts/${user.id}/${date}/`;
  // @todo think about sync usage in this place
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const imageData = await ctx.telegram.getFile(photo.file_id);
  if (!imageData.file_path) {
    throw new Error("Could not detect photo extension");
  }

  const extensionAr = imageData.file_path.split(".");
  const extension = extensionAr[extensionAr.length - 1];
  const filename = (Math.random() + 1).toString(36).substring(7);
  const fullpath = `${filePath}${filename}.${extension}`;

  try {
    const receiptFDecodingParams: IReceiptDecodingParams = {
      tgPath: imageData.file_path,
      localPath: fullpath,
      userId: user.id,
      photoId: photo.file_id,
      isTesting: false
    };
    const qrCode: IQrCode | null = await receiptService.receiptDecoding(
      receiptFDecodingParams
    );
    if (qrCode) {
      ctx.reply(
        `Чек декодирован: fd${qrCode.fd}, fpd:${qrCode.fpd}, fn:${qrCode.fn}, s:${qrCode.s}, n:${qrCode.n}`
      );
    } else {
      throw new Error("Чек не распознан");
    }
  } catch (e: any) {
    console.log("error: ", e.message);
    await ctx.reply(`
            Ошибка загрузки qr кода. 
            Доступные комманды:
            /menu - меню
            /help - помощь
            /support - служба поддержки
`);
  }
  return;
});

export default UploadReceipt;
