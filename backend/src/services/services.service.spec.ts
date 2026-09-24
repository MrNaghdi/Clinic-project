import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { ServicesService } from './services.service';
import { Service } from 'src/services/entities/service.entity';
import { CreateServiceDto } from 'src/services/dto/create-service.dto';
import { UpdateServiceDto } from 'src/services/dto/update-service.dto';

const mockService = {
  id: 1,
  name: 'میکرودرم',
  description: 'خدمات پوستی',
  price: 500000,
  is_active: true,
  created_at: new Date(),
};

const mockServiceList = [
  mockService,
  { ...mockService, id: 2, name: 'لیزر موهای زائد' },
];

describe('ServicesService', () => {
  let service: ServicesService;
  let serviceRepository: Repository<Service>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached services if available (Cache HIT) 🎯', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(mockServiceList);

      const result = await service.findAll();

      expect(result).toEqual(mockServiceList);
      expect(cacheManager.get).toHaveBeenCalledWith('services:all');
      expect(serviceRepository.find).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache it if cache is empty (Cache MISS) 💾', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(serviceRepository, 'find')
        .mockResolvedValue(mockServiceList as any);

      const result = await service.findAll();

      expect(result).toEqual(mockServiceList);
      expect(serviceRepository.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { created_at: 'DESC' },
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'services:all',
        mockServiceList,
        expect.any(Number),
      );
    });
  });

  describe('findById', () => {
    it('should return cached service if available (Cache HIT) ✅', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(mockService);

      const result = await service.findById(1);

      expect(result).toEqual(mockService);
      expect(cacheManager.get).toHaveBeenCalledWith('services:1');
      expect(serviceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache it (Cache MISS) 💾', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValue(mockService as any);

      const result = await service.findById(1);

      expect(result).toEqual(mockService);
      expect(serviceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, is_active: true },
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'services:1',
        mockService,
        expect.any(Number),
      );
    });

    it('should throw NotFoundException if service does not exist ❌', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateServiceDto = {
      name: 'میکرودرم',
      description: 'خدمات پوستی',
      price: 500000,
    } as any;

    it('should create a service and clear list cache ✅', async () => {
      jest
        .spyOn(serviceRepository, 'create')
        .mockReturnValue(mockService as any);
      jest
        .spyOn(serviceRepository, 'save')
        .mockResolvedValue(mockService as any);

      const result = await service.create(createDto);

      expect(result).toEqual(mockService);
      expect(serviceRepository.create).toHaveBeenCalledWith(createDto);
      expect(serviceRepository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('services:all');
    });
  });

  describe('updateService', () => {
    const updateDto: UpdateServiceDto = { name: 'میکرودرم پیشرفته' } as any;

    it('should update service and invalidate both caches ✅', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValue({ ...mockService } as any);
      jest
        .spyOn(serviceRepository, 'save')
        .mockResolvedValue({ ...mockService, ...updateDto } as any);

      const result = await service.updateService(1, updateDto);

      expect(result).toEqual({ ...mockService, ...updateDto });
      expect(serviceRepository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('services:all');
      expect(cacheManager.del).toHaveBeenCalledWith('services:1');
    });

    it('should throw NotFoundException if service not found ❌', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateService(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deactivateService', () => {
    it('should set is_active=false and invalidate caches ✅', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValue({ ...mockService } as any);
      jest
        .spyOn(serviceRepository, 'save')
        .mockImplementation(async (s: any) => s);

      const result = await service.deactivateService(1);

      expect(result.is_active).toBe(false);
      expect(serviceRepository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('services:all');
      expect(cacheManager.del).toHaveBeenCalledWith('services:1');
    });

    it('should throw NotFoundException if service not found ❌', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deactivateService(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});