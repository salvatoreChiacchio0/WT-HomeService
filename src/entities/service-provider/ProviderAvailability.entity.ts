import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ServiceProviders } from "./ServiceProvider.entity";

@Entity('provider_availability')
export class ProviderAvailability {
    @PrimaryGeneratedColumn()
    availability_id: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time' })
    start_time: string;

    @Column({ type: 'time' })
    end_time: string;

    @Column({ type: 'boolean', default: true })
    is_available: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int' })
    @ManyToOne(() => ServiceProviders, (provider) => provider.availability_slots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
    provider_id: number;
} 