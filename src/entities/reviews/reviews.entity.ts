import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProviders.entity';
import { Booking } from '../bookings/bookings.entity';
import { User } from '../users/users.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  customer_id: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  review_text: string;

  @Column()
  created_at: Date;

  @Column()
  provider_id: number;

  @Column()
  user_id: number;

  @Column()
  booking_id: number;

  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProviders;

  @ManyToOne(() => Booking, (booking) => booking.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => User, (user) => user.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

    @ManyToOne(() => User, (user) => user.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  providerUser: User;
}