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
  @Column( {type: 'int'})
  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.service, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'provider_id'})
  provider_id: number;

  @OneToMany(() => Booking, (booking) => booking.service_id)
  booking: Booking[];


}