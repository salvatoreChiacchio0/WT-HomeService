import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from '../users/users.entity';


@Entity({name:"admin_reports",comment:"class of the generic user",schema:"public"})
export class AdminReports extends BaseEntity{
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
  

  @Column( {type: 'int'})
  @ManyToOne(() => User, (user) => user.adminReports, { onDelete: 'CASCADE' }) // Relazione uno-a-molti
  @JoinColumn({ name: 'admin_id' }) // Specifica il nome della colonna nella tabella
  admin_id: User;
  
}

 