import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Otp, OtpPurpose } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  // generate otp code
  async generateOtp(phone: string, purpose:OtpPurpose) {
    const existingOtp = await this.otpRepository.findOne({
      where: {
        phone,
        isUsed: false,
        expired_time: MoreThan(new Date()),
      },
    });
    
    if (existingOtp) {
      throw new BadRequestException(
        'کد قبلی هنوز معتبر است. لطفاً تا زمان انقضای آن صبر کنید.',
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = this.otpRepository.create({
      phone,
      code,
      purpose,
      expired_time: new Date(Date.now() + 2 * 60 * 1000),
    });
    // save otp to database
    await this.otpRepository.save(otp);
    return {  
      phone,
      code,
      purpose,
    };
  }


  // verify otp code
  async verifyOtp(phone: string, code: string) {
    const existingOtp = await this.otpRepository.findOne({
      where: {
        phone,
        isUsed: false,
        expired_time: MoreThan(new Date()),
      }
    });
  
    if (!existingOtp) {
      throw new BadRequestException(
        'کد تایید پیدا نشد یا منقضی شده است.',
      );
    }
  
    if (existingOtp.code !== code) {
      throw new BadRequestException(
        'کد تایید وارد شده اشتباه است.',
      );
    }
  
    existingOtp.isUsed = true;
  
    await this.otpRepository.save(existingOtp);
  
    return {
      success: true,
      purpose: existingOtp.purpose,
    };
  }
}
