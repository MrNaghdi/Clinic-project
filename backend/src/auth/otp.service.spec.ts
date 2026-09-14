import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Otp, OtpPurpose } from './entities/otp.entity';

describe('OtpService', () => {
  let service: OtpService;
  let mockOtpRepository: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockOtpRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: getRepositoryToken(Otp),
          useValue: mockOtpRepository,
        },

        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  describe('generateOtp', () => {
    it('اگه OTP فعال قبلی وجود داشته باشه، باید BadRequestException بده', async () => {
      mockOtpRepository.findOne.mockResolvedValue({
        id: 1,
        phone: '09123456789',
        code: '123456',
        isUsed: false,
        expired_time: new Date(Date.now() + 60_000),
      });

      await expect(
        service.generateOtp('09123456789', OtpPurpose.REGISTER),
      ).rejects.toThrow(BadRequestException);
      expect(mockOtpRepository.create).not.toHaveBeenCalled();
      expect(mockOtpRepository.save).not.toHaveBeenCalled();
    });

    it('اگه OTP فعالی وجود نداشته باشه، باید یه OTP جدید بسازه و ذخیره کنه', async () => {
      mockOtpRepository.findOne.mockResolvedValue(null);
      mockOtpRepository.create.mockImplementation((data) => data);
      mockOtpRepository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.generateOtp('09123456789', OtpPurpose.LOGIN);
      expect(result.code).toMatch(/^\d{6}$/);
      expect(result.phone).toBe('09123456789');
      expect(result.purpose).toBe(OtpPurpose.LOGIN);

      expect(mockOtpRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyOtp', () => {
    it('اگه هیچ OTP معتبری پیدا نشه، باید BadRequestException بده', async () => {
      mockOtpRepository.findOne.mockResolvedValue(null);
      await expect(
        service.verifyOtp('09123456789', '123456'),
      ).rejects.toThrow(BadRequestException);
    });

    it('اگه کد وارد شده اشتباه باشه، باید BadRequestException بده', async () => {
      mockOtpRepository.findOne.mockResolvedValue({
        id: 1,
        phone: '09123456789',
        code: '111111',
        isUsed: false,
        expired_time: new Date(Date.now() + 60_000),
      });

      await expect(
        service.verifyOtp('09123456789', '999999'),
      ).rejects.toThrow(BadRequestException);

      expect(mockOtpRepository.save).not.toHaveBeenCalled();
    });

    it('اگه کد درست و معتبر باشه، باید موفق بشه و purpose رو برگردونه', async () => {
      const fakeOtp = {
        id: 1,
        phone: '09123456789',
        code: '123456',
        isUsed: false,
        purpose: OtpPurpose.REGISTER,
        expired_time: new Date(Date.now() + 60_000),
      };
      mockOtpRepository.findOne.mockResolvedValue(fakeOtp);
      mockOtpRepository.save.mockResolvedValue({ ...fakeOtp, isUsed: true });

      const result = await service.verifyOtp('09123456789', '123456');

      expect(result.success).toBe(true);
      expect(result.purpose).toBe(OtpPurpose.REGISTER);

      expect(mockOtpRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
