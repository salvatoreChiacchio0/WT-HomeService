import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column('text')
  text: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
} 