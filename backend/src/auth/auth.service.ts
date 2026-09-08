import { Injectable } from '@nestjs/common';
import { OtpPurpose } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

    // create token for user
    const token = this.jwtService.sign(
      { sub: user.id, phone: user.phone },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: Number(this.configService.get('JWT_ACCESS_EXPIRES_IN')),
      },
    );
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
