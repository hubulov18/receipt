"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFilterQuery = void 0;
const moment_1 = __importDefault(require("moment"));
const enums_1 = require("../enums");
/**
 * Filter for browse requests
 * @param request
 */
const transformFilterQuery = (request) => {
    const from = request.query.from
        ? (0, moment_1.default)(request.query.from)
        : null;
    const to = request.query.to
        ? (0, moment_1.default)(request.query.to)
        : null;
    return {
        uid: request.query.uid ? Number(request.query.uid) : null,
        page: Number(request.query.page || 1),
        limit: Number(request.query.limit || 50),
        from: from ? from.toDate() : null,
        to: to ? to.toDate() : null,
        sortOrder: request.query.sort_order === enums_1.DBSortOrder.DESC
            ? enums_1.DBSortOrder.DESC
            : enums_1.DBSortOrder.ASC
    };
};
exports.transformFilterQuery = transformFilterQuery;
