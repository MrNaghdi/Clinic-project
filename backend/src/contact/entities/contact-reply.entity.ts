import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ContactMessage } from './contact-message.entity';
  
  export enum ReplySenderType {
    User = 'user',
    Admin = 'admin',
  }
  
  @Entity('contact_replies')
  @Index(['contact_id', 'created_at'])
  export class ContactReply {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => ContactMessage, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contact_id' })
    contact: ContactMessage;
  
    @Column({ type: 'int' })
    contact_id: number;
  
    @Column({
      type: 'enum',
      enum: ReplySenderType,
    })
    sender_type: ReplySenderType;
  
    @Column({ type: 'int', nullable: true })
    sender_id: number | null;
  
    @Column({ type: 'text' })
    message: string;
  
    @CreateDateColumn()
    created_at: Date;
  }