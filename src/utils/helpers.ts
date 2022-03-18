import { Request } from "express";
import { IQueryFilter } from "../interfaces";
import moment from "moment";
import { DBSortOrder } from "../enums";

/**
 * Filter for browse requests
 * @param request
 */
export const transformFilterQuery = (request: Request): IQueryFilter => {
  const from: moment.Moment | null = request.query.from
    ? moment(request.query.from as string)
    : null;
  const to: moment.Moment | null = request.query.to
    ? moment(request.query.to as string)
    : null;
  return {
    uid: request.query.uid ? Number(request.query.uid) : null,
    page: Number(request.query.page || 1),
    limit: Number(request.query.limit || 50),
    from: from ? from.toDate() : null,
    to: to ? to.toDate() : null,
    sortOrder:
      request.query.sort_order === DBSortOrder.DESC
        ? DBSortOrder.DESC
        : DBSortOrder.ASC
  } as IQueryFilter;
};
