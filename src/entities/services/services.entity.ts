import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProviders.entity';
import { Booking } from '../bookings/bookings.entity';
import { Review } from '../review/review.entity';

@Entity('services')
export class Service {

  @PrimaryGeneratedColumn()
  service_id: number;
  @ApiProperty()
  @Column()
  service_name: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number | null;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column({ nullable: true })
  service_category: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  pricing_model: {
    base_price: number;
    hourly_rate?: number;
    minimum_hours?: number;
    additional_fees?: { description: string; amount: number }[];
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  availability: {
    days: string[];
    time_slots: { start: string; end: string }[];
    emergency_available: boolean;
  };

  @ApiProperty()
  @Column('text', { nullable: true })
  images: string;


  @ApiProperty()
  @Column({ name: 'provider_id', type: 'int', nullable: false })
  provider_id: number;

  @ManyToOne(() => ServiceProviders, provider => provider.services)
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProviders;

  @OneToMany(() => Booking, booking => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.service)
  reviews: Review[];

}