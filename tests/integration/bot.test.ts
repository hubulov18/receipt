import { FnsService } from "../../src/services/fns.service";
import { IQrCode } from "../../src/interfaces";

beforeAll(() => {});

test("some name", async () => {
  const fns: any = new FnsService();
  const qrCode: IQrCode = {
    fn: "9961440300100291",
    fd: "35684",
    fpd: "1107730888",
    n: 1,
    s: 288,
    boughtAt: new Date(2021, 11, 28, 19, 55)
  };

  const result = await fns.send(qrCode);
  const resultObj: object = {
    isSuccess: true,
    code: 200,
    data: {
      id: 4038451030243483000,
      ofdId: "ofd5",
      receiveDate: "2021-12-28T16:53:57Z",
      subtype: "receipt",
      address:
        "362047,Россия,Республика Северная Осетия - Алания,,Владикавказ г г.п.,,,Владикавказская ул элем. улично-дорожн.сети,,д. 8,,,,",
      content: {
        messageFiscalSign: 9297214437030849000,
        code: 3,
        fiscalDriveNumber: "9961440300100291",
        kktRegId: "0002448392030318    ",
        userInn: "150406489570",
        fiscalDocumentNumber: 35684,
        dateTime: 1640721300,
        fiscalSign: 1107730888,
        shiftNumber: 373,
        requestNumber: 107,
        operationType: 1,
        totalSum: 28800,
        properties: {
          propertyName: "mdlp",
          propertyValue: "sid00000000282616&"
        },
        items: [
          {
            propertiesItem: "mdlp8/30&",
            productCode: {
              rawProductCode: "444D03A65CA88692584B43523830435731324D5633",
              productIdType: 6,
              gtin: 4013054002834,
              sernum: "XKCR80CW12MV3"
            },
            name: "8/30 Нимесил гран 100мг N30 Berlin-C",
            price: 28800,
            quantity: 1,
            sum: 28800,
            nds: 6,
            ndsSum: 0,
            productType: 1,
            paymentType: 4
          }
        ],
        cashTotalSum: 28800,
        ecashTotalSum: 0,
        prepaidSum: 0,
        creditSum: 0,
        provisionSum: 0,
        operator: "Тажева Алана",
        appliedTaxationType: 4,
        fiscalDocumentFormatVer: 2,
        ndsNo: 28800,
        user: "Цораева Фатима Георгиевна",
        retailPlace: "аптека",
        region: "15",
        numberKkt: "00106206405097",
        redefine_mask: 10
      }
    }
  };
  expect(result).toEqual(resultObj);
});
