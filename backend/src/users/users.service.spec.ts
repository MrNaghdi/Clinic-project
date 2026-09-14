import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: any;

  beforeEach(async () => {
    mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findById', () => {
    it('اگه id=1 بود باید یوزر شماره 1 رو برگردونه', async () => {
      const fakeUser = {
        id: 1,
        first_name: 'erfan',
        phone: '09123456789',
      };
      mockUsersRepository.findOne.mockResolvedValue(fakeUser);
      const result = await service.findById(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(fakeUser);
    });
    it('اگه یوزر وجود نداشت باید null برگردونه', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      const result = await service.findById(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeNull();
    });
  });
  describe('findByPhone', () => {
    it('پیدا کردن یوزر با شماره تلفن', async () => {
      const fakeUser = {
        id: 1,
        first_name: 'erfan',
        phone: '09123456789',
      };
      mockUsersRepository.findOne.mockResolvedValue(fakeUser);
      const result = await service.findByPhone('09123456789');
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { phone: '09123456789' },
      });
      expect(result).toEqual(fakeUser);
    });
    it('در صورت نبود شماره تلفن باید null برگردونه', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      const result = await service.findByPhone('09123456789');
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { phone: '09123456789' },
      });
      expect(result).toBeNull();
    });
  });
  describe('create', () => {
    it('باید کاربر جدید بسازد و ذخیره کند', async () => {
      const newUser = { id: 1, phone: '09123456789' };
      mockUsersRepository.create.mockReturnValue(newUser);
      mockUsersRepository.save.mockResolvedValue(newUser);
      const result = await service.create('09123456789');
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        phone: '09123456789',
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });
  describe('incrementTokenVersion', () => {
    it('باید token_version را یک واحد افزایش دهد', async () => {
      const fakeUser = {
        id: 1,
        phone: '09123456789',
        token_version: 1,
      } as User;
      mockUsersRepository.findOne.mockResolvedValue(fakeUser);
      mockUsersRepository.save.mockResolvedValue({
        ...fakeUser,
        token_version: 2,
      } as User);
      const result = await service.incrementTokenVersion(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fakeUser.token_version).toBe(2);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(fakeUser);
      expect(result).toBe(2);
    });
    it('اگر کاربر وجود نداشته باشد باید NotFoundException پرتاب کند', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.incrementTokenVersion(999)).rejects.toThrow(
        'کاربر پیدا نشد.',
      );
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });
  describe('completeRegister', () => {
    it('باید نام و نام خانوادگی کاربر را تغییر دهد', async () => {
      const fakeUser = {
        id: 1,
        phone: '09123456789',
        first_name: null,
        last_name: null,
      };
      mockUsersRepository.findOne.mockResolvedValue(fakeUser);
      mockUsersRepository.save.mockResolvedValue({
        ...fakeUser,
        first_name: 'علی',
        last_name: 'محمدی',
      });
      const result = await service.completeRegister(1, 'علی', 'محمدی');
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fakeUser.first_name).toBe('علی');
      expect(fakeUser.last_name).toBe('محمدی');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual({
        ...fakeUser,
        first_name: 'علی',
        last_name: 'محمدی',
      });
    });
    it('اگر کاربر وجود نداشته باشد باید NotFoundException پرتاب کند', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(
        service.completeRegister(999, 'علی', 'محمدی'),
      ).rejects.toThrow('کاربر پیدا نشد.');
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });
  describe('updateProfileImage', () => {
    it('باید عکس پروفایل کاربر را تغییر دهد', async () => {
      const fakeUser = {
        id: 1,
        phone: '09123456789',
        profile_image: null,
      };
      mockUsersRepository.findOne.mockResolvedValue(fakeUser);
      mockUsersRepository.save.mockResolvedValue({
        ...fakeUser,
        profile_image: '/uploads/profiles/avatar.jpg',
      } as User);
      const result = await service.updateProfileImage(
        1,
        '/uploads/profiles/avatar.jpg',
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(fakeUser.profile_image).toBe('/uploads/profiles/avatar.jpg');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual({
        ...fakeUser,
        profile_image: '/uploads/profiles/avatar.jpg',
      });
    });
    it('اگر کاربر وجود نداشته باشد باید NotFoundException پرتاب کند', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateProfileImage(999, '/uploads/profiles/avatar.jpg'),
      ).rejects.toThrow('کاربر پیدا نشد.');
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });
});
