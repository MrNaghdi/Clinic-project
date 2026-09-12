import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Customer = 'customer',
  Specialist = 'specialist',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Customer })
  role: UserRole;
  @Column({ unique: true })
  phone: string;
  @Column({ nullable: true })
  profile_image: string;
  @Column({default:1})
  token_version:number
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
