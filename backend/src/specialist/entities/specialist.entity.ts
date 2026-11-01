import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkingHours } from './workingHours.entity';

export enum SpecialistStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Entity('specialists')
export class Specialist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({
    type: 'enum',
    enum: SpecialistStatus,
    default: SpecialistStatus.Pending,
  })
  status: SpecialistStatus;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => WorkingHours, (wh) => wh.specialist)
  working_hours: WorkingHours[];

  @ManyToMany(() => Service)
  @JoinTable({ name: 'specialist_services' })
  services: Service[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}