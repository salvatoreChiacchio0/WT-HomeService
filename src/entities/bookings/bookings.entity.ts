import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ServiceProviders } from '../service-provider/ServiceProvider.entity';
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
  status: string;

  @OneToMany(() => Review, (review) => review.booking_id)
  review: Review[];

  @ApiProperty()
  @Column( {type: 'int'})
  @ManyToOne(() => ServiceProviders, (serviceProvider) => serviceProvider.booking, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'provider_id'})
  provider_id: number;

  @ApiProperty()
  @Column({type: 'int'})
  @ManyToOne(() => Service, (service) => service.booking, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'service_id'})
  service_id: number;
  

 
}