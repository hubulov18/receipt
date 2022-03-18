"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receipt = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const good_1 = require("./good");
const enums_1 = require("../enums");
let Receipt = class Receipt {
    getQrCodeObject() {
        return {
            fn: this.fn,
            fd: this.fd,
            fpd: this.fpd,
            n: this.n,
            s: this.s,
            boughtAt: this.boughtAt
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({}),
    __metadata("design:type", Number)
], Receipt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "fn", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "fd", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "fpd", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], Receipt.prototype, "n", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Date)
], Receipt.prototype, "boughtAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "real", default: null, nullable: true }),
    __metadata("design:type", Number)
], Receipt.prototype, "s", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: enums_1.ReceiptStatus.HOLD }),
    __metadata("design:type", Number)
], Receipt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: enums_1.FnsStatus.NOT_CHECKED }),
    __metadata("design:type", Number)
], Receipt.prototype, "fnsStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "inn", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Date)
], Receipt.prototype, "lastCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "marketName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "checkErrorText", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], Receipt.prototype, "checkErrorCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Receipt.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Receipt.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Receipt.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.receipts),
    __metadata("design:type", user_1.User)
], Receipt.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => good_1.Good, (good) => good.receipt),
    __metadata("design:type", Array)
], Receipt.prototype, "goods", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false }),
    __metadata("design:type", Object)
], Receipt.prototype, "photo", void 0);
Receipt = __decorate([
    (0, typeorm_1.Entity)()
], Receipt);
exports.Receipt = Receipt;
