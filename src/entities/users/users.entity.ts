import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { ServiceProviders } from './service-providers.entity';

@Entity({name:"User",comment:"class of the generic user",schema:"public"})
export class User {
  @PrimaryGeneratedColumn({name:"user_id",comment:"id of the user"})
  user_id: number;
  
  
  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;
  
  @ApiProperty()
  @Column()
  password: string;
  
  @ApiProperty()
  @Column({ type: 'enum', enum: ['customer', 'provider', 'admin'] })
  role: string;
  
  @ApiProperty()
  @Column()
  first_name: string;
  
  @ApiProperty()
  @Column()
  last_name: string;
  
  @ApiProperty()
  @Column({ nullable: true })
  phone_number: string;
  
  @ApiProperty()
  @Column({ nullable: true })
  address: string;
  
  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  /*@OneToMany(() => ServiceProviders, (provider) => provider.user)
  service_providers: ServiceProviders[];*/
}