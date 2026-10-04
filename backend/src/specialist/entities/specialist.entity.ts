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
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column()
    bio: string;
    @Column({ type: 'enum', enum: SpecialistStatus, default: SpecialistStatus.Pending })
    status: SpecialistStatus;
    @Column({ default: true })
    is_active: boolean;
    @OneToMany(() => WorkingHours, (wh) => wh.specialist)
    working_hours: WorkingHours[];
    @ManyToMany(() => Service)
    @JoinTable()
    services: Service[];
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
