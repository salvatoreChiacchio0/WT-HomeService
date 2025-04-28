import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  user_id: number;

  @Column()
  provider_id: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @Column()
  created_at: Date;
}