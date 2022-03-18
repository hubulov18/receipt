"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSortOrder = exports.ReceiptStatus = exports.FnsStatus = void 0;
var FnsStatus;
(function (FnsStatus) {
    FnsStatus[FnsStatus["NOT_CHECKED"] = 0] = "NOT_CHECKED";
    FnsStatus[FnsStatus["SUCCESS"] = 1] = "SUCCESS";
    FnsStatus[FnsStatus["ERROR"] = 2] = "ERROR";
})(FnsStatus = exports.FnsStatus || (exports.FnsStatus = {}));
var ReceiptStatus;
(function (ReceiptStatus) {
    ReceiptStatus[ReceiptStatus["HOLD"] = 0] = "HOLD";
    ReceiptStatus[ReceiptStatus["IN_PROCESS"] = 1] = "IN_PROCESS";
    ReceiptStatus[ReceiptStatus["VALID"] = 2] = "VALID";
    ReceiptStatus[ReceiptStatus["INVALID"] = 3] = "INVALID";
})(ReceiptStatus = exports.ReceiptStatus || (exports.ReceiptStatus = {}));
var DBSortOrder;
(function (DBSortOrder) {
    DBSortOrder["ASC"] = "ASC";
    DBSortOrder["DESC"] = "DESC";
})(DBSortOrder = exports.DBSortOrder || (exports.DBSortOrder = {}));
