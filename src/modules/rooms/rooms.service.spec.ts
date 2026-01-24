
import { Test } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '@app/prisma/prisma.service';

describe('RoomsService', () => {
    let service: RoomsService;

    let prismaServiceMock = {
        room: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoomsService,
                { provide: PrismaService, useValue: prismaServiceMock }
            ],
        }).compile();

        service = moduleRef.get(RoomsService);
    });

    it('should return all rooms', async () => {
        const dataMock = [{ id: '123', name: 'room 1', capacity: 2 }]
        prismaServiceMock.room.findMany.mockResolvedValueOnce(dataMock)

        const res = await service.findAll();
        expect(prismaServiceMock.room.findMany).toHaveBeenCalledWith(
            {
                select: {
                    id: true,
                    name: true,
                    capacity: true
                }
            }
        )
        expect(res).toEqual(dataMock)
    });

    it('should create a room', async () => {
        const newRoom = { name: 'room 2', capacity: 3 }
        const newId = '1'

        prismaServiceMock.room.findFirst.mockResolvedValueOnce(null)
        prismaServiceMock.room.create.mockResolvedValueOnce({ id: newId, ...newRoom })

        const res = await service.create(newRoom)
        expect(res).toEqual({ id: newId, ...newRoom })
    })

    it('should update a room', async () => {
        const data = { capacity: 3 }
        const id = '123'

        prismaServiceMock.room.findUnique.mockResolvedValueOnce({ id: '123' })
        prismaServiceMock.room.update.mockResolvedValueOnce({ id, ...data })

        const res = await service.update(id, data)
        expect(res).toEqual({ id, ...data })
        expect(prismaServiceMock.room.update).toHaveBeenCalledWith(
            {
                where: { id },
                data: data
            }
        )
    })

    it('should delete room', async () => {
        const id = '123'

        prismaServiceMock.room.findUnique.mockResolvedValueOnce({ id })

        const res = await service.delete(id)

        expect(prismaServiceMock.room.delete).toHaveBeenCalledWith({
            where: { id }
        })
    })

    it('should throw UnauthorizedException if name is not available', async () => {
        prismaServiceMock.room.findFirst.mockResolvedValue({ id: '123' })

        const name = '';
        await expect(service.checkNameAvailability(name))
            .rejects.toThrow('ROOM_ALREADY_EXISTS')
    })

    it('should throw NotFoundException if room is not found', async () => {
        prismaServiceMock.room.findUnique.mockResolvedValue(null)

        const id = '123'
        await expect(service.checkExistence(id))
            .rejects.toThrow('ROOM_NOT_FOUND')
    })

});
