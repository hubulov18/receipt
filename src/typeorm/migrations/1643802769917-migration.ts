import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1643802769917 implements MigrationInterface {
    name = 'migration1643802769917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer NOT NULL, "name" character varying, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "receipt" ("id" SERIAL NOT NULL, "fn" character varying, "fd" character varying, "fpd" character varying, "n" integer, "boughtAt" TIMESTAMP, "s" real, "status" integer NOT NULL DEFAULT '0', "fnsStatus" integer NOT NULL DEFAULT '0', "inn" character varying, "address" character varying, "lastCheck" TIMESTAMP, "marketName" character varying, "checkErrorText" character varying, "checkErrorCode" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "photo" json NOT NULL, CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "good" ("id" SERIAL NOT NULL, "price" real NOT NULL, "name" character varying NOT NULL, "quantity" real NOT NULL, "sum" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "receiptId" integer, CONSTRAINT "PK_0aceec75d523693a51fad812e2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "good" ADD CONSTRAINT "FK_8aa758cb874c9663f72c15f934e" FOREIGN KEY ("receiptId") REFERENCES "receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good" DROP CONSTRAINT "FK_8aa758cb874c9663f72c15f934e"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca"`);
        await queryRunner.query(`DROP TABLE "good"`);
        await queryRunner.query(`DROP TABLE "receipt"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
