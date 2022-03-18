import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1646743617299 implements MigrationInterface {
    name = 'migration1646743617299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "userId" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_e011d4704c491f4d821d7ebb6ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
