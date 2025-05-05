import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../users/users.entity";
import { Service } from "../services/services.entity";
import { Booking } from "../bookings/bookings.entity";
import { Review } from "../reviews/reviews.entity";
@Entity('service_providers')
export class ServiceProviders{
    @PrimaryGeneratedColumn()
    provider_id: number;
    
    @ApiProperty()
    @Column( {type: 'int'})
    @ManyToOne(() => User, (users) => users.service_providers, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'user_id' }) 
    user_id: number; 

    @ApiProperty()
    @Column({nullable: true})
    experience_years: number;

    @ApiProperty()
    @Column({type: 'numeric', precision: 5, scale: 2, nullable: true})
    rating: number | null 

    @ApiProperty()
    @Column({nullable: true})
    availability: string ;
    
    @ApiProperty()
    @Column({nullable: false})
    name: string;

    @ApiProperty()
    @Column({nullable: true})
    pricing_model: string ;

    @OneToMany(() => Service, (service) => service.provider_id)
    service: Service[];

    @OneToMany(() => Booking, (booking) => booking.provider_id)
    booking: Booking[];

    @OneToMany(() => Review, (review) => review.provider_id)
    review: Review[];


}
