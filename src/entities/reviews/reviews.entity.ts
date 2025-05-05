import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProvider.entity';
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

  @ApiProperty()
  @Column( {type: 'int'})
  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.review, {onDelete: 'CASCADE'} )
  @JoinColumn({name: 'provider_id'})
  provider_id: number;

  @ApiProperty()
  @Column({type: 'int'})
  @ManyToOne(() => Booking, (booking) => booking.review, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'booking_id'})
  booking_id: number;

  @ApiProperty()
  @Column({type: 'int'})
  @ManyToOne(() => User, (user) => user.review, {onDelete: 'CASCADE'} )
  @JoinColumn({name: 'user_id'})
  user_id: number;
}