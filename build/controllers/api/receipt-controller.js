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
exports.get = void 0;
const receipt_1 = require("../../repositories/receipt");
const helpers_1 = require("../../utils/helpers");
/**
 * @param request
 * @param response
 */
const get = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = (0, helpers_1.transformFilterQuery)(request);
        const receipts = yield (0, receipt_1.getReceiptsFiltered)(filter);
        response.send(receipts);
    }
    catch (e) {
        response.status(500).send(e.message);
    }
});
exports.get = get;
