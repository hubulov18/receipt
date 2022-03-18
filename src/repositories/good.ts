import { Good, Receipt } from "../models";
import { IGood } from "../interfaces";
import { getRepository } from "typeorm";
export const storeGood = async (payload: IGood): Promise<Good | null> => {
  const goodRepository = getRepository(Good);
  const good = new Good();
  return await goodRepository.save({
    ...good,
    ...payload
  });
};
