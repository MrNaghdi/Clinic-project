import {
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { ContactSubject } from '../entities/contact-message.entity';
  
  export class CreateContactDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    full_name?: string;
  
    @IsOptional()
    @Matches(/^09\d{9}$/, { message: 'شماره تلفن نامعتبر است' })
    phone?: string;
  
    @IsEnum(ContactSubject)
    subject: ContactSubject;
  
    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    message: string;
  }