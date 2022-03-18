import { getRepository } from "typeorm";
import { Receipt } from "../models";
import { ICreateReceiptData, IQrCode, IQueryFilter } from "../interfaces";
import { ReceiptStatus } from "../enums";

export const getReceiptsFiltered = async (
  filter: IQueryFilter
): Promise<Array<Receipt>> => {
  const query: any = getRepository(Receipt).createQueryBuilder("receipt");
  if (filter.uid) {
    query.andWhere("receipt.userId = :userId", { userId: filter.uid });
  }
  if (filter.from) {
    query.andWhere("receipt.createdAt >= :from", { from: filter.from });
  }
  if (filter.to) {
    query.andWhere("receipt.createdAt <= :to", { to: filter.to });
  }

  query
    .offset((filter.page - 1) * filter.limit)
    .limit(filter.limit)
    .orderBy("receipt.createdAt", filter.sortOrder);

  return await query.getMany();
};

export const getReceiptsByUser = async (
  userId: number,
  page: number = 1,
  limit: number = 50
): Promise<Array<Receipt>> => {
  const receiptRepository = getRepository(Receipt);
  const start: number = (page - 1) * limit;
  const result: Array<Receipt> = await receiptRepository
    .createQueryBuilder("receipts")
    .where({ userId: userId })
    .orderBy("receipts.createdAt", "DESC")
    .offset(start)
    .limit(limit)
    .getMany();

  return result;
};

export const getReceiptsForReadQr = async (): Promise<Array<Receipt>> => {
  const receiptRepository = getRepository(Receipt);
  return await receiptRepository.find({
    where: { status: ReceiptStatus.HOLD }
  });
};

export const storeReceipt = async (
  payload: ICreateReceiptData
): Promise<Receipt | null> => {
  const receiptRepository = getRepository(Receipt);
  const receipt = new Receipt();
  return await receiptRepository.save({
    ...receipt,
    ...payload
  });
};

export const deleteReceipt = async (id: any): Promise<void> => {
  await getRepository(Receipt)
    .createQueryBuilder("receipt")
    .delete()
    .from(Receipt)
    .where("id = :id", { id })
    .execute();
};

export const updateQrCodeInfo = async (
  payload: IQrCode,
  filename: string
): Promise<void> => {
  await getRepository(Receipt)
    .createQueryBuilder("receipt")
    .update(Receipt)
    .set({ ...payload })
    .where("receipt.photo ::jsonb @> :photo", { photo: { filename } })
    .execute();
};
