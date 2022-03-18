"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQrCodeInfo = exports.deleteReceipt = exports.storeReceipt = exports.getReceiptsForReadQr = exports.getReceiptsByUser = exports.getReceiptsFiltered = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const enums_1 = require("../enums");
const getReceiptsFiltered = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, typeorm_1.getRepository)(models_1.Receipt).createQueryBuilder("receipt");
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
    return yield query.getMany();
});
exports.getReceiptsFiltered = getReceiptsFiltered;
const getReceiptsByUser = (userId, page = 1, limit = 50) => __awaiter(void 0, void 0, void 0, function* () {
    const receiptRepository = (0, typeorm_1.getRepository)(models_1.Receipt);
    const start = (page - 1) * limit;
    const result = yield receiptRepository
        .createQueryBuilder("receipts")
        .where({ userId: userId })
        .orderBy("receipts.createdAt", "DESC")
        .offset(start)
        .limit(limit)
        .getMany();
    return result;
});
exports.getReceiptsByUser = getReceiptsByUser;
const getReceiptsForReadQr = () => __awaiter(void 0, void 0, void 0, function* () {
    const receiptRepository = (0, typeorm_1.getRepository)(models_1.Receipt);
    return yield receiptRepository.find({
        where: { status: enums_1.ReceiptStatus.HOLD }
    });
});
exports.getReceiptsForReadQr = getReceiptsForReadQr;
const storeReceipt = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const receiptRepository = (0, typeorm_1.getRepository)(models_1.Receipt);
    const receipt = new models_1.Receipt();
    return yield receiptRepository.save(Object.assign(Object.assign({}, receipt), payload));
});
exports.storeReceipt = storeReceipt;
const deleteReceipt = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.getRepository)(models_1.Receipt)
        .createQueryBuilder("receipt")
        .delete()
        .from(models_1.Receipt)
        .where("id = :id", { id })
        .execute();
});
exports.deleteReceipt = deleteReceipt;
const updateQrCodeInfo = (payload, filename) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.getRepository)(models_1.Receipt)
        .createQueryBuilder("receipt")
        .update(models_1.Receipt)
        .set(Object.assign({}, payload))
        .where("receipt.photo ::jsonb @> :photo", { photo: { filename } })
        .execute();
});
exports.updateQrCodeInfo = updateQrCodeInfo;
