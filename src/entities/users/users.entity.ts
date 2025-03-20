import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { ServiceProviders } from './service-providers.entity';

@Entity({name:"User",comment:"class of the generic user"})
export class Users {
  @PrimaryGeneratedColumn({name:"user_id",comment:"id of the user"})
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['customer', 'provider', 'admin'] })
  role: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  /*@OneToMany(() => ServiceProviders, (provider) => provider.user)
  service_providers: ServiceProviders[];*/
}