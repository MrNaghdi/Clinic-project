import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpPurpose } from './entities/otp.entity';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  let mockConfigService: any;
  let mockJwtService: any;
  let mockOtpService: any;
  let mockUsersService: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
      getOrThrow: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    mockOtpService = {
      generateOtp: jest.fn(),
      verifyOtp: jest.fn(),
    };

    mockUsersService = {
      findByPhone: jest.fn(),
      create: jest.fn(),
      incrementTokenVersion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('sendOtp', () => {
    it('اگه کاربر با این شماره وجود نداشته باشه، باید purpose را REGISTER بفرستد', async () => {
      mockUsersService.findByPhone.mockResolvedValue(null);

      mockOtpService.generateOtp.mockResolvedValue({
        phone: '09123456789',
        code: '123456',
        purpose: OtpPurpose.REGISTER,
      });
      await service.sendOtp('09123456789');
      expect(mockOtpService.generateOtp).toHaveBeenCalledWith(
        '09123456789',
        OtpPurpose.REGISTER,
      );
    });

    it('اگه کاربر با این شماره از قبل وجود داشته باشد، باید purpose را LOGIN بفرستد', async () => {
      mockUsersService.findByPhone.mockResolvedValue({
        id: 1,
        phone: '09123456789',
      });

      mockOtpService.generateOtp.mockResolvedValue({
        phone: '09123456789',
        code: '123456',
        purpose: OtpPurpose.LOGIN,
      });
      await service.sendOtp('09123456789');
      expect(mockOtpService.generateOtp).toHaveBeenCalledWith(
        '09123456789',
        OtpPurpose.LOGIN,
      );
    });
  });

  describe('verifyOtp', () => {
    it('اگه purpose برابر REGISTER باشد، باید کاربر جدید بسازد (نه پیدا کند)', async () => {

      mockOtpService.verifyOtp.mockResolvedValue({
        success: true,
        purpose: OtpPurpose.REGISTER,
      });

      const fakeNewUser = {
        id: 5,
        phone: '09123456789',
        token_version: 1,
      };
      mockUsersService.create.mockResolvedValue(fakeNewUser);
      mockUsersService.incrementTokenVersion.mockResolvedValue(2);
      mockJwtService.sign.mockReturnValue('fake-jwt-token');
      await service.verifyOtp('09123456789', '123456');
      expect(mockUsersService.create).toHaveBeenCalledWith('09123456789');
      expect(mockUsersService.findByPhone).not.toHaveBeenCalled();
    });

    it('اگه purpose برابر LOGIN باشد، باید کاربر موجود را پیدا کند (نه بسازد)', async () => {
      mockOtpService.verifyOtp.mockResolvedValue({
        success: true,
        purpose: OtpPurpose.LOGIN,
      });

      const fakeExistingUser = {
        id: 5,
        phone: '09123456789',
        token_version: 3,
      };
      mockUsersService.findByPhone.mockResolvedValue(fakeExistingUser);
      mockUsersService.incrementTokenVersion.mockResolvedValue(4);
      mockJwtService.sign.mockReturnValue('fake-jwt-token');

      await service.verifyOtp('09123456789', '123456');
      expect(mockUsersService.findByPhone).toHaveBeenCalledWith(
        '09123456789',
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('باید incrementTokenVersion را صدا بزند و از نتیجه‌اش در توکن استفاده کند', async () => {
      mockOtpService.verifyOtp.mockResolvedValue({
        success: true,
        purpose: OtpPurpose.LOGIN,
      });

      const fakeUser = { id: 7, phone: '09123456789' };
      mockUsersService.findByPhone.mockResolvedValue(fakeUser);
      mockUsersService.incrementTokenVersion.mockResolvedValue(99);

      mockJwtService.sign.mockReturnValue('fake-jwt-token');
      await service.verifyOtp('09123456789', '123456');

      expect(mockUsersService.incrementTokenVersion).toHaveBeenCalledWith(7);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 7,
          phone: '09123456789',
          token_version: 99,
        }),
      );
    });

    it('باید توکن نهایی را در خروجی برگرداند', async () => {
      mockOtpService.verifyOtp.mockResolvedValue({
        success: true,
        purpose: OtpPurpose.LOGIN,
      });
      mockUsersService.findByPhone.mockResolvedValue({
        id: 1,
        phone: '09123456789',
      });
      mockUsersService.incrementTokenVersion.mockResolvedValue(1);
      mockJwtService.sign.mockReturnValue('this-is-the-final-token');
      const result = await service.verifyOtp('09123456789', '123456');
      expect(result.token).toBe('this-is-the-final-token');
    });
  });
});
