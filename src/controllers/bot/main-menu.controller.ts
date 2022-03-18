import { Scenes } from "telegraf";
import { getUser, createUser } from "../../repositories/user";
import strings from "../../utils/strings";
const MainMenu = new Scenes.BaseScene("main-menu");

MainMenu.enter(async (ctx: any) => {
  const uid = ctx.from.id as number;
  const user = await getUser(uid);
  if (!user) {
    const newUser = createUser({
      id: uid,
      name: ctx.from.username,
      phone: undefined
    });
  }

  await ctx.reply(`
Главное меню. 
Доступные комманды:
   /info - информация 
   /upload - загрузка чека
   /list - список загруженных чеков
    `);
});

MainMenu.command("info", (ctx: any) => {
  return ctx.reply(strings.mainMenu.info_text);
});

MainMenu.command("upload", (ctx: any) => {
  return ctx.scene.enter("upload-receipt");
});

MainMenu.command("list", async (ctx: any) => {
  return ctx.scene.enter("receipt-list");
});

MainMenu.on("text", (ctx: any) => {
  return ctx.reply("Ты находишься в главном меню");
});

MainMenu.leave(async (ctx: any) => {});

export default MainMenu;
