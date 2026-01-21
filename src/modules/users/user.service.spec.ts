
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { Role } from '@app/generated/prisma/enums';

describe('CatsController', () => {
    let service: UsersService;

    const prismaMock = {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
    };


    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService, {
                    provide: PrismaService, useValue: prismaMock
                }],
        }).compile();

        service = moduleRef.get(UsersService);
    });

    it('should create user', async () => {
        const userMock = { email: 'test@test.com', password: 'admin123', role: Role.USER };

        prismaMock.user.findUnique.mockResolvedValueOnce(null);
        prismaMock.user.create.mockResolvedValueOnce({ id: '1', ...userMock })

        const res = await service.create(userMock);
        expect(res.id).toEqual('1');
    });

    it('should update user', async () => {
        const userMock = { email: 'update@test.com' };
        const idMock = '123'

        prismaMock.user.update.mockResolvedValueOnce({ id: idMock, ...userMock })

        const res = await service.update(idMock, userMock);

        expect(res.id).toEqual(idMock);
        expect(prismaMock.user.update).toHaveBeenCalledWith(
            {
                where: { id: idMock },
                data: { ...userMock }
            }
        )
    });

    it('should findAll users', async () => {
        const dataMock = [{ id: '2', email: 'test@test.com', role: Role.USER }];

        prismaMock.user.findMany.mockResolvedValueOnce(dataMock)

        const res = await service.findAll();

        expect(res).toEqual(dataMock)
        expect(prismaMock.user.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                email: true,
                role: true
            }
        })
    })

    it('should return user by email', async () => {
        const dbUser = {
            id: '1',
            email: 'test@test.com',
            password: "admin123",
            role: Role.USER,
        };

        prismaMock.user.findUnique.mockResolvedValue(dbUser);

        const res = await service.findByEmail('test@test.com');

        expect(res).toEqual(dbUser);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@test.com' },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            },
        });
    })

    it('should throw if user not found in findByEmail', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(
            service.findByEmail('noexiste@test.com'),
        ).rejects.toThrow('USER_NOT_FOUND');
    });

    it('should throw if user not found in checkExistence', async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);
        const idMock = '123'

        await expect(
            service.checkExistence(idMock),
        ).rejects.toThrow('USER_NOT_FOUND');
    });

    it('should throw if user already exist in checkEmailAvailability', async () => {
        const userMock = { id: '123' };

        prismaMock.user.findUnique.mockResolvedValueOnce(userMock);

        await expect(service.checkEmailAvailability('test@test.com')).rejects.toThrow('USER_ALREADY_EXIST');
    });

});
