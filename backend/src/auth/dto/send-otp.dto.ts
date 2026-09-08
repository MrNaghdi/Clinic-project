import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تلفن باید با فرمت صحیح ایرانی باشد (مثلاً 09123456789)',
  })
  phone: string;
}
