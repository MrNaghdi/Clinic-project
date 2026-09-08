import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تلفن باید با فرمت صحیح ایرانی باشد (مثلاً 09123456789)',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'کد باید دقیقاً ۶ رقم باشد' })
  code: string;
}
