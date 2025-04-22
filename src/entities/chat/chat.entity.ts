import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/users.entity';
  
  @Entity('messages')
  export class Message {
    @PrimaryGeneratedColumn()
    message_id: number;
  
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'sender_id' })
    sender: User;
  
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;
  
    @Column('text')
    message_text: string;
  
    @CreateDateColumn({ type: 'timestamp', nullable: true })
    sent_at: Date;
  }
  