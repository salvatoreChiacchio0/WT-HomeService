import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../users/users.entity";
import { Service } from "../services/services.entity";
import { Booking } from "../bookings/bookings.entity";
import { Review } from "../reviews/reviews.entity";
import { ProviderImage } from "./ProviderImage.entity";
import { ProviderCertificate } from "./ProviderCertificate.entity";
import { ProviderAvailability } from "./ProviderAvailability.entity";

@Entity('service_providers')
export class ServiceProviders {
    @PrimaryGeneratedColumn()
    provider_id: number;
    
    @Column({ type: 'int' })
    user_id: number;

    @ApiProperty()
    @ManyToOne(() => User, (users) => users.service_providers, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'user_id' }) 
    user: User;

    @ApiProperty()
    @Column({ nullable: true })
    experience_years: number;

    @ApiProperty()
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    rating: number | null 

    @ApiProperty()
    @Column({ nullable: true })
    availability: string;
    
    @ApiProperty()
    @Column({ nullable: false })
    name: string;

    @ApiProperty()
    @Column({ nullable: true })
    pricing_model: string;

    @ApiProperty()
    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    hourly_rate: number | null;

    @ApiProperty()
    @Column({ type: 'json', nullable: true })
    service_categories: string[];

    @OneToMany(() => Service, (service) => service.provider)
    services: Service[];

    @OneToMany(() => Booking, (booking) => booking.provider)
    bookings: Booking[];

    @OneToMany(() => Review, (review) => review.provider)
    reviews: Review[];

    @OneToMany(() => ProviderImage, (image: ProviderImage) => image.provider_id)
    images: ProviderImage;

    @OneToMany(() => ProviderCertificate, (certificate: ProviderCertificate) => certificate.provider_id)
    certificates: ProviderCertificate[];

    @OneToMany(() => ProviderAvailability, (availability: ProviderAvailability) => availability.provider_id)
    availability_slots: ProviderAvailability[];
}
