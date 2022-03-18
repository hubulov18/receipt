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
exports.migration1643802769917 = void 0;
class migration1643802769917 {
    constructor() {
        this.name = 'migration1643802769917';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user" ("id" integer NOT NULL, "name" character varying, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "receipt" ("id" SERIAL NOT NULL, "fn" character varying, "fd" character varying, "fpd" character varying, "n" integer, "boughtAt" TIMESTAMP, "s" real, "status" integer NOT NULL DEFAULT '0', "fnsStatus" integer NOT NULL DEFAULT '0', "inn" character varying, "address" character varying, "lastCheck" TIMESTAMP, "marketName" character varying, "checkErrorText" character varying, "checkErrorCode" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "photo" json NOT NULL, CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "good" ("id" SERIAL NOT NULL, "price" real NOT NULL, "name" character varying NOT NULL, "quantity" real NOT NULL, "sum" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "receiptId" integer, CONSTRAINT "PK_0aceec75d523693a51fad812e2e" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "good" ADD CONSTRAINT "FK_8aa758cb874c9663f72c15f934e" FOREIGN KEY ("receiptId") REFERENCES "receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "good" DROP CONSTRAINT "FK_8aa758cb874c9663f72c15f934e"`);
            yield queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca"`);
            yield queryRunner.query(`DROP TABLE "good"`);
            yield queryRunner.query(`DROP TABLE "receipt"`);
            yield queryRunner.query(`DROP TABLE "user"`);
        });
    }
}
exports.migration1643802769917 = migration1643802769917;
