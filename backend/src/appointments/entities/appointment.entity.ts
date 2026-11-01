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
  
  export enum AppointmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Completed = 'completed',
    Cancelled = 'cancelled',
    NoShow = 'no_show',
  }
  
  @Entity('appointments')
  @Index(['specialist_id', 'date', 'start_time'])
  @Index(['customer_id', 'status'])
  export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;
  
    // ═══ Relations ═══
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customer_id' })
    customer: User;
  
    @Column({ type: 'int' })
    customer_id: number;
  
    @ManyToOne(() => Specialist, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'specialist_id' })
    specialist: Specialist;
  
    @Column({ type: 'int' })
    specialist_id: number;
  
    @ManyToOne(() => Service, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: Service;
  
    @Column({ type: 'int' })
    service_id: number;
  
    // ═══ Date & Time ═══
  
    @Column({ type: 'date' })
    date: string;
  
    @Column({ type: 'time' })
    start_time: string;
  
    @Column({ type: 'time' })
    end_time: string;
  
    // ═══ Details ═══
  
    @Column({
      type: 'enum',
      enum: AppointmentStatus,
      default: AppointmentStatus.Pending,
    })
    status: AppointmentStatus;
  
    @Column({ type: 'text', nullable: true })
    notes: string | null;
  
    @Column({ type: 'int' })
    price: number;
  
    @Column({ type: 'int' })
    duration_minutes: number;
  
    // ═══ Cancellation ═══
  
    @Column({ type: 'text', nullable: true })
    cancel_reason: string | null;
  
    @Column({ type: 'timestamp', nullable: true })
    cancelled_at: Date | null;
  
    // ═══ Timestamps ═══
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }