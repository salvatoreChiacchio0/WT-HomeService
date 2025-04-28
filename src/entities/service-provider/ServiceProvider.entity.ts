import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity('service_providers')
export class ServiceProviders{
    @PrimaryGeneratedColumn()
    provider_id: number;

    @Column()
    user_id: number; 

    @Column({nullable: true})
    experience_years: number;

    @Column({type: 'numeric', precision: 5, scale: 2, nullable: true})
    rating: number | null 

    @Column({nullable: true})
    availability: string ;

    @Column({nullable: true})
    pricing_model: string ;


}
