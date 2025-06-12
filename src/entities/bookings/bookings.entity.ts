import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProviders.entity';
import { Service } from '../services/services.entity';
import { Review } from '../reviews/reviews.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column()
  user_id: number;

  @Column()
  booking_date: Date;

  @Column()
  booking_time: string;

  @Column()
  status: string;


  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Review, (review) => review.booking)
  reviews: Review[];

  @Column()
  provider_id: number;

  @ApiProperty()
  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProviders;

  @Column()
  service_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @ManyToOne(() => Service, (service) => service.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}