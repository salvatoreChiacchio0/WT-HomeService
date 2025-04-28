import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { AdminReports } from '../admin-reports/admin_reports.entity';
// import { ServiceProviders } from './service-providers.entity';

export enum Role {
  Customer = "customer",
  Admin = "admin",
  User = "user"
}

@Entity({name:"User",comment:"class of the generic user",schema:"public"})
export class User extends BaseEntity{
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
  @Column({ type: 'enum', enum: Role })
  role: Role[];
  
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

  @OneToMany(() => AdminReports, (report) => report.admin_id)
  adminReports: AdminReports[];

  /*@OneToMany(() => ServiceProviders, (provider) => provider.user)
  service_providers: ServiceProviders[];*/
}

