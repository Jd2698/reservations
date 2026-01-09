import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto, UpdateResrvationDto } from './dto';
import { UUID } from 'crypto';

@Injectable()
export class ReservationsService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return this.prismaService.reservation.findMany();
    }

    async create(createReservationDto: CreateReservationDto, authUserId: string) {
        const { userId, startTime, endTime } = createReservationDto;

        if (!userId) {
            createReservationDto.userId = authUserId;
        }

        return this.prismaService.reservation.create({
            data: {
                ...createReservationDto,
                userId: createReservationDto.userId as string,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });
    }

    async update(id: string, updateReservationDto: UpdateResrvationDto, authUserId: string) {
        const { userId, startTime, endTime } = updateReservationDto;

        const exists = await this.checkExistence(id);
        if (!exists) throw new NotFoundException('Reservation not found');

        if (!userId) {
            updateReservationDto.userId = authUserId;
        }

        return this.prismaService.reservation.update({
            where: { id },
            data: {
                ...updateReservationDto,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
            },
        });
    }

    async delete(id: string) {
        const exists = await this.checkExistence(id);
        if (!exists) throw new NotFoundException('Reservation not found');

        return this.prismaService.reservation.delete({
            where: { id },
        });
    }

    async checkExistence(id: string): Promise<boolean> {
        const reservation = await this.prismaService.reservation.findUnique({
            where: { id },
            select: { id: true },
        });

        return !!reservation;
    }
}
