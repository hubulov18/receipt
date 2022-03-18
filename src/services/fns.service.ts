import { ISaveFnsResult, IQrCode } from "../interfaces";
import https from "https";
import { fnsConfig } from "../config";
import { IncomingMessage } from "http";
import { getRepository } from "typeorm";
import { Good, Receipt } from "../models";
import { FnsStatus, ReceiptStatus } from "../enums";
import { storeGood } from "../repositories/good";
import { IGood } from "../interfaces";

/**
 *
 */
export class FnsService {
  public async send(qrCode: IQrCode) {
    const queryString = this.getQueryStr(qrCode);
    const url = `${fnsConfig.url}/?${queryString}`;
    return await this.request(url);
  }
  private async request(url: string) {
    return await new Promise((resolve, reject) => {
      let body: Array<any> = [];
      const request = https.get(url, function (res: IncomingMessage) {
        res.on("data", (chunk) => body.push(chunk));
        res.on("end", () => {
          const data = Buffer.concat(body).toString();
          resolve(JSON.parse(data));
        });
      });
      request.on("error", (e) => {
        console.log(`ERROR httpsGet: ${e}`);
        reject(e);
      });
      request.end();
    });
  }

  private getQueryStr(qrCode: IQrCode): string {
     qrCode.boughtAt=new Date(qrCode.boughtAt.getTime()+3*60*60*1000)
    return `fn=${qrCode.fn}&fp=${qrCode.fpd}&i=${qrCode.fd}&t=${qrCode.boughtAt
      .toISOString()
      .slice(0, 19)}&s=${qrCode.s * 100}&n=${qrCode.n}`;
  }

  public async saveFnsResult(
    payload: ISaveFnsResult,
    id: number
  ): Promise<void> {
    let Incorrect: number[] = [400, 406, 452, 528, 453, 454];
    let NotFound: number[] = [404, 455];
    const receipt = await getRepository(Receipt);
    if (Incorrect.includes(payload.code)) {
      await receipt
        .createQueryBuilder("receipt")
        .update(Receipt)
        .set({
          fnsStatus: FnsStatus.ERROR,
          status: ReceiptStatus.INVALID,
          checkErrorCode: payload.code,
          checkErrorText: payload.message,
          lastCheck: new Date(Date.now())
        })
        .where("receipt.id = :id", { id })
        .execute();
    }
    if (payload.code === 200) {
      const receiptOne = await getRepository(Receipt).findOne({ id });
      for (let i = 0; i < payload.data.content.items.length; i++) {
        const good: IGood = {
          price: payload.data.content.items[i].price,
          quantity: payload.data.content.items[i].quantity,
          name: payload.data.content.items[i].name,
          sum: payload.data.content.items[i].sum,
          createdAt: (payload.data.content.items[i].createdAt = new Date(
            Date.now()
          )),
          updatedAt: (payload.data.content.items[i].updatedAt = new Date(
            Date.now()
          )),
          receipt: receiptOne
        };
        await storeGood(good);
      }

      await receipt
        .createQueryBuilder("receipt")
        .update(Receipt)
        .set({
          fnsStatus: FnsStatus.SUCCESS,
          status: ReceiptStatus.VALID,
          inn: payload.data.content.userInn,
          marketName: payload.data.content.retailPlace,
          address: payload.data.address,
          lastCheck: new Date(Date.now())
        })
        .where("receipt.id = :id", { id })
        .execute();
    }

    if (NotFound.includes(payload.code)) {
      await receipt
        .createQueryBuilder("receipt")
        .update(Receipt)
        .set({
          fnsStatus: FnsStatus.NOT_CHECKED,
          checkErrorCode: payload.code,
          checkErrorText: payload.message,
          lastCheck: new Date(Date.now())
        })
        .where("receipt.id = :id", { id })
        .execute();
    }
  }
}
