import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
export enum OtpPurpose {
  REGISTER = 'register',
  LOGIN = 'login',
}
@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 6 })
  code: string;
  @Column()
  @Index()
  phone: string;
  @Column({ type: 'enum', enum: OtpPurpose })
  purpose: OtpPurpose;
  @Exclude()
  @Column()
  expired_time: Date;
  @Exclude()
  @Column({ default: false })
  isUsed: boolean;
  @Exclude()
  @CreateDateColumn()
  created_at: Date;
}
