import { DBSortOrder, FnsStatus, ReceiptStatus } from "./enums";
import { Receipt } from "./models";

/**
 * Info about photo
 */
export interface IPhoto {
  id: string;
  filename: string;
  fullpath: string;
  extension: string;
}

/**
 * Receipt info from qr code
 */
export interface IQrCode {
  fn: string;
  fd: string;
  fpd: string;
  n: number;
  s: number;
  boughtAt: Date;
}

export interface ICreateUserPayload {
  id: number;
  name: string;
  phone: string | undefined;
}

// export interface IUpdateUserPayload {
//     // name: string|null;
//     email: string|null;
// }

export interface IWebHookData {
  url: string;
  port: number;
  webhook: string;
}

export interface ICreateReceiptData {
  userId: number;
  photo: IPhoto;
}

export interface ISaveFnsResult {
  code: number;
  data: any;
  message: any;
}

export interface IUpdateReceiptStatus {
  status: ReceiptStatus | null;
  fnsStatus: FnsStatus | null;
}

export interface ICommand {
  command: string;
  description: string;
}

export interface IGood {
  price: number;
  quantity: number;
  name: string;
  sum: number;
  createdAt: Date;
  updatedAt: Date;
  receipt: Receipt | undefined;
}

export interface IQueryFilter {
  uid: Number | null;
  from: Date | null;
  to: Date | null;
  page: number;
  limit: number;
  sortOrder: DBSortOrder | null;
}

export interface IReceiptDecodingParams {
  tgPath: string;
  localPath: string;
  userId: number;
  photoId: string;
  isTesting: boolean;
}
