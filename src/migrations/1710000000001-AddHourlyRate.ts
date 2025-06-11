import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHourlyRate1710000000001 implements MigrationInterface {
    name = 'AddHourlyRate1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_providers" ADD "hourly_rate" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_providers" DROP COLUMN "hourly_rate"`);
    }
} 