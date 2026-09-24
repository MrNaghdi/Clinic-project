import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum SpecialistStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}
@Entity('specialists')
export class Specialist {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column()
    bio: string;
    @Column({ type: 'enum', enum: SpecialistStatus, default: SpecialistStatus.Pending })
    status: SpecialistStatus;
    @Column({ default: true })
    is_active: boolean;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @ManyToMany(() => Service)
    @JoinTable()
    services: Service[];
}
