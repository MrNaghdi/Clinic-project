import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Specialist } from '../../specialist/entities/specialist.entity';
import { Service } from '../../services/entities/service.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('reviews')
@Index(['specialist_id', 'is_approved'])
@Index(['service_id', 'is_approved'])
@Index(['appointment_id'], { unique: true })
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'int' })
    user_id: number;

    @ManyToOne(() => Specialist, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'specialist_id' })
    specialist: Specialist;

    @Column({ type: 'int' })
    specialist_id: number;

    @ManyToOne(() => Service, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'service_id' })
    service: Service | null;

    @Column({ type: 'int', nullable: true })
    service_id: number | null;

    @ManyToOne(() => Appointment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment;

    @Column({ type: 'int' })
    appointment_id: number;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string | null;

    @Column({ default: false })
    is_approved: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 