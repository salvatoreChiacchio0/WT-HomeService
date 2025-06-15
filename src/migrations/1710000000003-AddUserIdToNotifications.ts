import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToNotifications1710000000003 implements MigrationInterface {
    name = 'AddUserIdToNotifications1710000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD COLUMN "user_id" integer NOT NULL,
            ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notifications" 
            DROP CONSTRAINT "FK_notifications_user",
            DROP COLUMN "user_id"
        `);
    }
} 