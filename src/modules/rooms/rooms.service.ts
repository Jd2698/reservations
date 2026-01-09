import { PrismaService } from '@app/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

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

    async create(createRoomDto: any) {
        return this.prismaService.room.create({
            data: createRoomDto
        });
    }

    async update(id: string, updateRoomDto: any) {
        return this.prismaService.room.update({
            where: { id },
            data: updateRoomDto
        });
    }

    async delete(id: string) {
        const exists = await this.prismaService.room.count({ where: { id } });

        if (exists == 0) throw new NotFoundException('Room not found');

        return this.prismaService.room.delete({
            where: { id }
        });
    }
}