import { Injectable } from '@nestjs/common';
import { OtpPurpose } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) {}
  // send otp for phone
  async sendOtp(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    const purpose = user ? OtpPurpose.LOGIN : OtpPurpose.REGISTER;
    return this.otpService.generateOtp(phone, purpose);
  }

  // verify phone and code
  async verifyOtp(phone: string, code: string) {
    const otp = await this.otpService.verifyOtp(phone, code);
    let user;
    if (otp.purpose === OtpPurpose.REGISTER) {
      user = await this.usersService.create(phone);
    } else {
      user = await this.usersService.findByPhone(phone);
    }
    const token_version = await this.usersService.incrementTokenVersion(user.id)
    // create token for user
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      token_version,
    };
    const token = this.jwtService.sign(payload);
    return {
      message:
        otp.purpose === OtpPurpose.REGISTER
          ? 'کاربر با موفیقت ثبت نام شد.'
          : 'کاربر با موفقیت لاگین شد.',
      user,
      token,
    };
  }
}
