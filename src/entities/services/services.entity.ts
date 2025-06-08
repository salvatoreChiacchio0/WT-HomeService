import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProvider.entity';
import { Booking } from '../bookings/bookings.entity';

@Entity('services')
export class Service {

  @PrimaryGeneratedColumn()
  service_id: number;
  @ApiProperty()
  @Column()
  service_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'int' })
  price: number | null;

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
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  certificates: string[];

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  requirements: {
    equipment_needed: string[];
    qualifications: string[];
    special_instructions: string;
  };

  @ApiProperty()
  @Column()
  service_category: string;

  @ApiProperty()
  @Column({ type: 'int' })
  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.service, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'provider_id'})
  provider_id: number;

  @OneToMany(() => Booking, (booking) => booking.service_id)
  booking: Booking[];


}