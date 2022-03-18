import { getRepository } from "typeorm";
import { User } from "../models";
import { ICreateUserPayload, IQueryFilter } from "../interfaces";

export const getUsersFiltered = async (
  filter: IQueryFilter
): Promise<Array<User>> => {
  const query: any = getRepository(User).createQueryBuilder("users");

  return await query
    .offset((filter.page - 1) * filter.limit)
    .limit(filter.limit)
    .orderBy("users.createdAt", filter.sortOrder)
    .getMany();
};

export const createUser = async (
  payload: ICreateUserPayload
): Promise<User> => {
  const userRepository = getRepository(User);
  const user = new User();

  return userRepository.save({
    ...user,
    ...payload
  });
};

export const getUser = async (id: number): Promise<User | null> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ id: id });
  if (!user) return null;
  return user;
};

// export const updateUser = async (id: number, )
