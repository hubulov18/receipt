import { readFile } from "../utils/files";
import { Receipt } from "../models";
import { IPhoto, IQrCode, IReceiptDecodingParams } from "../interfaces";
import Jimp from "jimp";
import moment from "moment";
import fs, { WriteStream } from "fs";
import { appConfig } from "../config";
import https from "https";
import {
  deleteReceipt,
  storeReceipt,
  updateQrCodeInfo
} from "../repositories/receipt";

const QrCode = require("qrcode-reader");

/**
 * @todo: для чтения qr возможно сделать отдельные сервис
 *
 */
export class ReceiptService {
  /**
   *
   * @param receipt
   * @private
   */
  private async readQrCode(receipt: Receipt): Promise<IQrCode | null> {
    const qrCodeStr = await this.readQr(receipt);
    let qrCode = null;
    if (qrCodeStr) {
      qrCode = this.parseQr(qrCodeStr);
    }
    return qrCode;
  }

  /**
   *
   * @param code
   * @private
   */
  private parseQr(code: string): IQrCode {
    let query = code.split("&").map((el) => el.split("="));
    let queryMap: any = {};
    for (let elem of query) {
      queryMap[elem[0]] = elem[1];
    }
    let qrCode: IQrCode = {
      fd: queryMap.i,
      fn: queryMap.fn,
      fpd: queryMap.fp,
      s: Number(queryMap.s),
      n: Number(queryMap.n),
      boughtAt: moment(queryMap.t).toDate()
    };
    return qrCode;
  }

  /**
   *
   * @param receipt
   * @private
   */
  private async readQr(receipt: Receipt): Promise<any | null> {
    let buffer = await readFile(receipt.photo.fullpath);
    try {
      let code = await new Promise(async (resolve, reject) => {
        try {
          const image = await Jimp.read(buffer);
          let qr = new QrCode();
          qr.callback = function (err: any, value: any) {
            if (err) {
              reject(err);
            }
            if (value && value.result) {
              resolve(value.result);
            } else {
              reject("Не смог распознать qr код");
            }
          };
          qr.decode(image.bitmap);
        } catch (e: any) {
          reject(e.message);
        }
      });
      return code;
    } catch (e) {
      return null;
    }
  }

  /**
   * Decode receipt qrcode by photo to get info
   * @param data
   */
  public async receiptDecoding(
    data: IReceiptDecodingParams
  ): Promise<IQrCode | null> {
    const extensionAr: Array<string> = data.tgPath.split(".");
    const extension = extensionAr[extensionAr.length - 1];
    const filename = (Math.random() + 1).toString(10).substring(7);
    const fullPath = `${data.localPath}${filename}.${extension}`;
    const url = `https://api.telegram.org/file/bot${appConfig.token}/${data.tgPath}`;

    const filestream: WriteStream = fs.createWriteStream(fullPath);

    const promise: Promise<IQrCode | null> = new Promise(
      async (resolve, reject) => {
        // //https://api.telegram.org/bot<token>/getfile?file_id={the file_id of the photo you want to download}
        const request = https.get(url, function (response) {
          response.pipe(filestream);
        });
        filestream.on("finish", async () => {
          const receipt: Receipt | null = await storeReceipt({
            userId: data.userId,
            photo: {
              id: data.photoId,
              filename: filename,
              fullpath: fullPath,
              extension: extension
            } as IPhoto
          });
          let qrCode: IQrCode | null = null;
          if (receipt) {
            qrCode = await this.readQrCode(receipt); //.catch(async (e) => {});
            if (qrCode) {

              await updateQrCodeInfo(qrCode, filename);
              resolve(qrCode);
            } else {
              await deleteReceipt(receipt.id);
              reject("Error read qr");
            }
          }
        });
        await request;
      }
    );
    return await promise;
  }
}
