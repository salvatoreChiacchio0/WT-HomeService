import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({name:"admin_reports",comment:"class of the generic user",schema:"public"})
export class AdminReports {
  @PrimaryGeneratedColumn({name:"report_id",comment:"id of the report"})
  report_id: number;
  
  @ApiProperty()
  @Column({ unique: true })
  report_type: string;
  
  @ApiProperty()
  @Column()
  data: string;
  
  @ApiProperty()
  @Column({})
  generated_at: Date;
  
  @ApiProperty()
  @Column()
  admin_id: number;
  
}

