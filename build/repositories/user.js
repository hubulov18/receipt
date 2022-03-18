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
exports.getUser = exports.createUser = exports.getUsersFiltered = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const getUsersFiltered = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, typeorm_1.getRepository)(models_1.User).createQueryBuilder("users");
    return yield query
        .offset((filter.page - 1) * filter.limit)
        .limit(filter.limit)
        .orderBy("users.createdAt", filter.sortOrder)
        .getMany();
});
exports.getUsersFiltered = getUsersFiltered;
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(models_1.User);
    const user = new models_1.User();
    return userRepository.save(Object.assign(Object.assign({}, user), payload));
});
exports.createUser = createUser;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(models_1.User);
    const user = yield userRepository.findOne({ id: id });
    if (!user)
        return null;
    return user;
});
exports.getUser = getUser;
// export const updateUser = async (id: number, )
