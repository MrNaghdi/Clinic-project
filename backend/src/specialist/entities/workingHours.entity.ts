import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Specialist } from './specialist.entity';

@Entity('working_hours')
export class WorkingHours {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Specialist, (specialist) => specialist.working_hours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @Column({ name: 'specialist_id', type: 'int' })
  specialist_id: number;

  @Column({ type: 'int' })
  day_of_week: number;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;
}