import { Scenes } from "telegraf";
import { getUser } from "../../repositories/user";
import { getReceiptsByUser } from "../../repositories/receipt";
import { FnsStatus, ReceiptStatus } from "../../enums";
import { SceneContext } from "telegraf/typings/scenes";

const ReceiptList = new Scenes.BaseScene("receipt-list");

const getFnsStatusText = (fnsStatus: FnsStatus) => {
  switch (fnsStatus) {
    case FnsStatus.NOT_CHECKED:
      return "Не проверен";
    case FnsStatus.SUCCESS:
      return "Успешно";
    case FnsStatus.ERROR:
      return "Ошибка";
  }
};

const getReceiptStatusText = (receiptStatus: ReceiptStatus) => {
  switch (receiptStatus) {
    case ReceiptStatus.HOLD:
      return "Ожидает";
    case ReceiptStatus.IN_PROCESS:
      return "В процессе";
    case ReceiptStatus.VALID:
      return "Валидный";
    case ReceiptStatus.INVALID:
      return "Невалидный";
  }
};

const startReceiptList = async (ctx: any, toStart: boolean = true) => {
  const uid = ctx.from.id as number;
  const user = await getUser(uid);
  if (!user) {
    return ctx.scene.enter("main-menu");
  }

  if (toStart) {
    ctx.session.receiptPage = 1;
  }

  let receipts = await getReceiptsByUser(user.id, ctx.session.receiptPage, 1);
  if (!receipts.length) {
    ctx.reply(`
Конец списка.
Доступные комманды: 
  /more - более старые
  /totop - в начало
  /menu - в меню
    `);
  } else {
    ctx.session.receiptPage = ctx.session.receiptPage + 1;

    ctx.reply(`
  Загруженные чеки:
  ${receipts.map((el) => {
    return `
      - Чек № ${el.id}. Статус фнс: ${getFnsStatusText(
      el.fnsStatus
    )}. Статус чека: ${getReceiptStatusText(el.status)}
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
};

ReceiptList.enter(async (ctx: any) => {
  await startReceiptList(ctx);
});

ReceiptList.command("to-top", async (ctx) => {
  await startReceiptList(ctx);
});

ReceiptList.command("more", async (ctx: any) => {
  const uid = ctx.from.id as number;
  const user = await getUser(uid);
  if (!user) {
    return (ctx as SceneContext).scene.enter("main-menu");
  }
  await startReceiptList(ctx, false);
});

ReceiptList.command("menu", (ctx) => {
  (ctx as SceneContext).scene.enter("main-menu");
});

export default ReceiptList;
