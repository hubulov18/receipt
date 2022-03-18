import { ReceiptService } from "../../src/services/receipt.service";
import { IQrCode, IReceiptDecodingParams } from "../../src/interfaces";
import { createConnection, getConnection } from "typeorm";
import { testDatabaseConfig } from "../../src/config";
import Jimp from "jimp";
import moment from "moment";


describe("Receipt service tests", () => {
  beforeAll(async () => {
    // https://dev.to/walrusai/testing-database-interactions-with-jest-519n
    await createConnection(testDatabaseConfig) // connect to database
        .then(() => console.log("Test db started"))
        .catch((err) => {
          console.log("Error on start test db!", err);
        });
  });

  afterAll(async () => {
    const defaultConnection = getConnection('test')
    await defaultConnection.close()
  });
  test("parse-qr-test", async () => {
    const receipt = new ReceiptService();
    const data: IReceiptDecodingParams = {
      tgPath: "photos/file_184.jpg",
      localPath:
        "/home/vadim/Desktop/receiptchecker/uploads/receipts/testFloder/testReceipt",
      userId: 383025811,
      photoId:
        "AgACAgIAAxkBAAIHAWH41AFRKdgd9hanCFZFbUEQXSMoAAJJtjEb4uHAS6jJlICF5HCnAQADAgADeQADIwQ",
      isTesting: true
    };
    const expResult: IQrCode = {
      fd: "35684",
      fn: "9961440300100291",
      fpd: "1107730888",
      s: 288.00,
      n: 1,
      boughtAt: moment("20211228T1955").toDate()
    };
    const result: IQrCode | null = await receipt.receiptDecoding(data);

    expect(result).toBe(expResult);
  }, 100000);
  test("readFileJimp", async () => {
    const buffer: any = await Jimp.read(
      "/home/kirill/job/digital12/receiptChecker/uploads/receipts/229610799/2021_12_22/1v5v.jpg"
    );
    expect(buffer).not.toBeNull();
  });
});
