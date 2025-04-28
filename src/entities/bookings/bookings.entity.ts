import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column()
  user_id: number;

  @Column()
  provider_id: number;

  @Column()
  service_id: number;

  @Column()
  booking_date: Date;

  @Column()
  status: string;
}