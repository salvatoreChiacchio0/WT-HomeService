import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ServiceProviders } from "./ServiceProvider.entity";

@Entity('provider_images')
export class ProviderImage {
    @PrimaryGeneratedColumn()
    image_id: number;

    @Column('text')
    base64_image: string;

    @Column()
    image_type: string; // 'profile', 'service', 'portfolio'

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    uploaded_at: Date;

    @Column({ type: 'int' })
    provider_id: number;

    @ManyToOne(() => ServiceProviders, (provider: ServiceProviders) => provider.images)
    @JoinColumn({ name: 'provider_id' })
    provider: ServiceProviders;
} 