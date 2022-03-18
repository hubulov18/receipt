import https from "https";
import { ICommand } from "../interfaces";

export class BotService {
  // `https://api.telegram.org/bot${token}/setMyCommands`,
  public async setMyCommands(
    token: string,
    commands: Array<ICommand>
  ): Promise<void> {
    const result = await new Promise(async (resolve, reject) => {
      const options = {
        hostname: "api.telegram.org",
        port: 443,
        path: `/bot${token}/setMyCommands`,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // 'Content-Length': data.length
        },
        body: { commands: commands }
      };
      const req = await https.request(options, (res) => {
        res.on("data", (d) => {
          resolve(d);
        });
      });
      req.on("error", (error: any) => {
        reject(error);
      });
      console.log("setMyCommands");
    });

    console.log("setMyCommands", result);
  }
}
