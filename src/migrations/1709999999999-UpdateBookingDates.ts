import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookingDates1709999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update existing records with NULL booking_date to use current date
        await queryRunner.query(`
            UPDATE bookings 
            SET booking_date = CURRENT_DATE 
            WHERE booking_date IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No need for down migration as we're fixing data
    }
} 