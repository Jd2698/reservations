import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from './dto';

@Injectable()
export class RoomsService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return this.prismaService.room.findMany({
            select: {
                id: true,
                name: true,
                capacity: true,
            }
        });
    }

    async create(dto: CreateRoomDto) {
        await this.checkNameAvailability(dto.name)

        return this.prismaService.room.create({
            data: dto
        });
    }

    async update(roomId: string, dto: UpdateRoomDto) {
        await this.checkExistence(roomId)

        return this.prismaService.room.update({
            where: { id: roomId },
            data: dto
        });
    }

    async delete(roomId: string) {
        await this.checkExistence(roomId)

        return this.prismaService.room.delete({
            where: { id: roomId }
        });
    }

    async checkNameAvailability(name: string) {
        const room = await this.prismaService.room.findFirst({
            where: {
                name
            },
            select: {
                id: true
            }
        })

        if (room) throw new UnauthorizedException('ROOM_ALREADY_EXISTS');
    }

    async checkExistence(id: string) {
        const room = await this.prismaService.room.findUnique({
            where: { id },
            select: { id: true }
        })

        if(!room) throw new NotFoundException('ROOM_NOT_FOUND')
    }
}