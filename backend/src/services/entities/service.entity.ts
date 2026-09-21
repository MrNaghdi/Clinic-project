import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('services')
@Check(`"duration_minutes" > 0`)
@Check(`"price" >= 0`)
export class Service {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Index()
  name: string;
  @Column({ nullable: true })
  description: string ;
  @Column({ type: 'int' })
  duration_minutes: number;
  @Column({ type: 'int' })
  price: number;
  @Column({ default: true })
  is_active: boolean;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
