import moment from "moment";
import cron from "node-cron";
import { BaseJob } from "./base.job";
import { getReceiptsForReadQr } from "../repositories/receipt";
import { ISaveFnsResult } from "../interfaces";
import { FnsService } from "../services/fns.service";
import {log} from "util";
const fs = require('fs')

const writeF= async (content: any) => {
  fs.appendFile('file.txt','11\n', function (error: any, bytes: any){
    if (error) throw error
    //console.log('Record was succeed')
   // console.log(bytes)
  })
}
/**
 * ReceiptCheckFns
 * Отправка чеков в фнс для проверки
 */
export class ReceiptCheckFns extends BaseJob {
  private fnsService: FnsService;
  constructor() {
    super();
    this.fnsService = new FnsService();
  }

  public launch(): void {
    this.task = cron.schedule("*/5 * * * * *", async () => {
      console.log("receipt-check-fns job started");
      const receipts = await getReceiptsForReadQr();
      let data: any = {};
      for(let i=0; i<10000;i++) {
        data = await this.fnsService.send(receipts[0].getQrCodeObject());
        console.log('status ',data.status.code,'iteration ',i)

    //    console.log(data)
    /*    let result: ISaveFnsResult = {
          code: data.code,
          data: data.data,
          message: data.message
        };
     //   await this.fnsService.saveFnsResult(result, r.id); */
      }
    });
  }
}
