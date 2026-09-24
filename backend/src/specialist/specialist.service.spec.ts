import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { SpecialistService } from './specialist.service';
import { Specialist, SpecialistStatus } from './entities/specialist.entity';
import { WorkingHours } from './entities/workingHours.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

const mockSpecialist = {
    id: 1,
    bio: 'Test Bio',
    status: SpecialistStatus.Approved,
    is_active: true,
    user: { id: 10 },
};

const mockUser = { id: 10, role: UserRole.Customer };

describe('SpecialistService', () => {
    let service: SpecialistService;
    let specialistRepository: Repository<Specialist>;
    let workingHoursRepository: Repository<WorkingHours>;
    let cacheManager: Cache;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SpecialistService,
                {
                    provide: getRepositoryToken(Specialist),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(WorkingHours),
                    useValue: {},
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        findById: jest.fn(),
                        updateRole: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SpecialistService>(SpecialistService);
        specialistRepository = module.get<Repository<Specialist>>(
            getRepositoryToken(Specialist),
        );
        cacheManager = module.get<Cache>(CACHE_MANAGER);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return cached specialists if available (Cache HIT)', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValue([mockSpecialist]);

            const result = await service.findAll();

            expect(result).toEqual([mockSpecialist]);
            expect(cacheManager.get).toHaveBeenCalledWith('specialist:all');
            expect(specialistRepository.find).not.toHaveBeenCalled();
        });

        it('should fetch from DB and cache it if cache is empty (Cache MISS)', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
            jest
                .spyOn(specialistRepository, 'find')
                .mockResolvedValue([mockSpecialist as any]);

            const result = await service.findAll();

            expect(result).toEqual([mockSpecialist]);
            expect(cacheManager.get).toHaveBeenCalledWith('specialist:all');
            expect(specialistRepository.find).toHaveBeenCalledWith({
                where: { is_active: true, status: SpecialistStatus.Approved },
            });
            expect(cacheManager.set).toHaveBeenCalledWith(
                'specialist:all',
                [mockSpecialist],
                expect.any(Number),
            );
        });
    });

    describe('findById', () => {
        it('should return cached specialist if available', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValue(mockSpecialist);

            const result = await service.findById(1);

            expect(result).toEqual(mockSpecialist);
            expect(cacheManager.get).toHaveBeenCalledWith('specialist:1');
            expect(specialistRepository.findOne).not.toHaveBeenCalled();
        });

        it('should fetch from DB and cache it if not in cache', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
            jest
                .spyOn(specialistRepository, 'findOne')
                .mockResolvedValue(mockSpecialist as any);

            const result = await service.findById(1);

            expect(result).toEqual(mockSpecialist);
            expect(specialistRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, is_active: true, status: SpecialistStatus.Approved },
            });
            expect(cacheManager.set).toHaveBeenCalledWith(
                'specialist:1',
                mockSpecialist,
                expect.any(Number),
            );
        });

        it('should throw NotFoundException if specialist does not exist', async () => {
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
            jest.spyOn(specialistRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        const createDto: CreateSpecialistDto = {
            user_id: 10,
            bio: 'New Bio',
        };

        it('should create a specialist successfully', async () => {
            // آرنج
            jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
            jest.spyOn(specialistRepository, 'findOne').mockResolvedValue(null);
            jest
                .spyOn(specialistRepository, 'create')
                .mockReturnValue(mockSpecialist as any);
            jest
                .spyOn(specialistRepository, 'save')
                .mockResolvedValue(mockSpecialist as any);

            const result = await service.create(createDto);
            expect(result).toEqual(mockSpecialist);
            expect(usersService.findById).toHaveBeenCalledWith(10);
            expect(specialistRepository.save).toHaveBeenCalled();
            expect(usersService.updateRole).toHaveBeenCalledWith(
                10,
                UserRole.Specialist,
            );
            expect(cacheManager.del).toHaveBeenCalledWith('specialist:all');
        });

        it('should throw NotFoundException if user does not exist', async () => {
            jest.spyOn(usersService, 'findById').mockResolvedValue(null);

            await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
            expect(specialistRepository.save).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if user is already a specialist', async () => {
            jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
            jest
                .spyOn(specialistRepository, 'findOne')
                .mockResolvedValue(mockSpecialist as any);

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
            expect(specialistRepository.save).not.toHaveBeenCalled();
        });
    });
});