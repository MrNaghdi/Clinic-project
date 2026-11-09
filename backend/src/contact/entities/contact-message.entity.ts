import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactReply } from './contact-reply.entity';

export enum ContactSubject {
  General = 'general',
  Complaint = 'complaint',
  Suggestion = 'suggestion',
  Booking = 'booking',
  Other = 'other',
}

export enum TicketStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Resolved = 'resolved',
  Closed = 'closed',
}

@Entity('contact_messages')
@Index(['is_read', 'created_at'])
export class ContactMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number | null;

  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ContactSubject,
    default: ContactSubject.General,
  })
  subject: ContactSubject;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.Open,
  })
  status: TicketStatus;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_reply_at: Date | null;

  @OneToMany(() => ContactReply, (r) => r.contact)
  replies: ContactReply[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}