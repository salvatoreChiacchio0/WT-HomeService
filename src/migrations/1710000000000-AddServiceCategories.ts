import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceCategories1710000000000 implements MigrationInterface {
    name = 'AddServiceCategories1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_providers" ADD "service_categories" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_providers" DROP COLUMN "service_categories"`);
    }
} 