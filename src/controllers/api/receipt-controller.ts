import { getReceiptsFiltered } from "../../repositories/receipt";
import { Request, Response } from "express";
import { Receipt } from "../../models";
import { IQueryFilter } from "../../interfaces";
import { transformFilterQuery } from "../../utils/helpers";

/**
 * @param request
 * @param response
 */
export const get = async (request: Request, response: Response) => {
  try {
    const filter: IQueryFilter = transformFilterQuery(request);
    const receipts: Array<Receipt> | null = await getReceiptsFiltered(filter);
    response.send(receipts);
  } catch (e: any) {
    response.status(500).send(e.message);
  }
};
