import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationsTable1710000000002 implements MigrationInterface {
    name = 'CreateNotificationsTable1710000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" SERIAL NOT NULL,
                "type" character varying NOT NULL,
                "text" text NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "sender_id" integer,
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
                CONSTRAINT "FK_notifications_sender" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }
} 