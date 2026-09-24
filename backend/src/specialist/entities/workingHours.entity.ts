import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Specialist } from './specialist.entity';
export enum DayOfWeek {
    Saturday = 'saturday',
    Sunday = 'sunday',
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
}
@Entity('working_hours')
export class WorkingHours {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Specialist)
    @JoinColumn({ name: 'specialist_id' })
    specialist: Specialist;
    @Column({ type: 'enum', enum: DayOfWeek })
    day_of_week: DayOfWeek;
    @Column({type: 'time'})
    start_time: string;
    @Column({type: 'time'})
    end_time: string;
}
