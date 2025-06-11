import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ServiceProviders } from "./ServiceProviders.entity";

@Entity('provider_certificates')
export class ProviderCertificate {
    @PrimaryGeneratedColumn()
    certificate_id: number;

    @Column()
    file_name: string;

    @Column()
    file_path: string;

    @Column()
    certificate_name: string;

    @Column({ nullable: true })
    certificate_type: string; // 'professional', 'insurance', 'license'

    @Column({ type: 'timestamp', nullable: true })
    issue_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiry_date: Date | null;

    @Column({ type: 'int' })
    provider_id: number;

    @Column({ default: false })
    is_verified: boolean;

    @ManyToOne(() => ServiceProviders, (provider: ServiceProviders) => provider.certificates)
    @JoinColumn({ name: 'provider_id' })
    provider: ServiceProviders;
} 