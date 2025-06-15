import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../entities/users/users.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'type', type: 'varchar', nullable: true })
  type: string;

  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'sender_id', type: 'uuid', nullable: true })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 