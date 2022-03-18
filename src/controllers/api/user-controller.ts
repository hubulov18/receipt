import validator from "validator";
import { Request, Response } from "express";
import { createUser, getUsersFiltered } from "../../repositories/user";
import { ICreateUserPayload, IQueryFilter } from "../../interfaces";
import { transformFilterQuery } from "../../utils/helpers";

export const get = async (request: Request, response: Response) => {
  try {
    const filter: IQueryFilter = transformFilterQuery(request);
    const users = await getUsersFiltered(filter);
    response.send(users);
  } catch (e: any) {
    response.status(500).send(e.message);
  }
};

export const store = async (request: Request, response: Response) => {
  try {
    if (
      request.body.name &&
      validator.isMobilePhone(`+${request.body.phone}`, "ru-RU")
    ) {
      const id = (Math.random() + 1) * 1000000000;
      const user: ICreateUserPayload = {
        id: Math.ceil(id),
        name: String(request.body.name),
        phone: `+${String(request.body.phone)}`
      };
      await createUser(user);
      response.sendStatus(201);
    } else throw new Error("Input data error");
  } catch (e: any) {
    response.status(500).send(e.message);
  }
};
