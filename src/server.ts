import router from "./router";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { appConfig } from "./config";

export default class Server {
  private app: Express;
  private async startServer() {
    this.app = express();
    this.app.use(bodyParser.json());
    await this.app.listen(appConfig.port || 5000);
    this.app.use("/api", router);
    console.log(`Api server has been started on port ${appConfig.port}`);
  }

  public async start() {
    await this.startServer();
  }
}
