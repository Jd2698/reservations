import { PrismaService } from '@app/prisma/prisma.service';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto, RescheduleReservationDto } from './dto';
import { ReservationStatus } from '@app/generated/prisma/enums';

@Injectable()
export class ReservationsService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return this.prismaService.reservation.findMany();
    }

    async create(dto: CreateReservationDto, authUserId: string) {

        const userId = dto.userId ?? authUserId;
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        // throw error if date is invalid
        await this.validateDate({
            roomId: dto.roomId,
            startTime,
            endTime,
        });

        return this.prismaService.reservation.create({
            data: {
                ...dto,
                userId,
                startTime,
                endTime,
            },
        });
    }

    async reschedule(reservationId: string, dto: RescheduleReservationDto, authUserId: string) {

        const reservation = await this.getValidReservationForUser(reservationId, authUserId);

        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        await this.validateDate({
            roomId: reservation.roomId,
            startTime,
            endTime,
            reservationId
        })

        return this.prismaService.reservation.update({
            where: { id: reservation.id },
            data: {
                startTime,
                endTime,
            },
        });
    }

    async cancel(reservationId: string, authUserId: string) {

        const reservation = await this.getValidReservationForUser(reservationId, authUserId);

        return this.prismaService.reservation.update({
            where: { id: reservation.id },
            data: {
                status: ReservationStatus.CANCELLED,
            },
        });
    }

    async delete(id: string) {
        const exists = await this.checkExistence(id);
        if (!exists) throw new NotFoundException('RESERVATION_NOT_FOUND');

        return this.prismaService.reservation.delete({
            where: { id },
        });
    }

    async getValidReservationForUser(reservationId: string, authUserId: string) {

        const reservation = await this.prismaService.reservation.findUnique({
            where: { id: reservationId },
        });

        if (!reservation) {
            throw new NotFoundException('RESERVATION_NOT_FOUND');
        }

        if (reservation.userId !== authUserId) {
            throw new ForbiddenException('NOT_ALLOWED');
        }

        if (
            reservation.status === ReservationStatus.CANCELLED ||
            reservation.status === ReservationStatus.EXPIRED
        ) {
            throw new BadRequestException('RESERVATION_NOT_CANCELLABLE');
        }

        return reservation;
    }

    async validateDate(params: {
        roomId: string;
        startTime: Date;
        endTime: Date;
        reservationId?: string;
    }) {
        const { roomId, reservationId, startTime, endTime } = params;


        const now = new Date();
        const bufferMs = 60 * 1000; // 1 minute buffer

        if (startTime.getTime() < now.getTime() + bufferMs) {
            throw new BadRequestException('START_TIME_IN_PAST');
        }

        if (startTime >= endTime) {
            throw new BadRequestException('INVALID_DATE_RANGE');
        }

        const conflict = await this.prismaService.reservation.findFirst({
            where: {
                roomId: roomId,
                id: reservationId ? { not: reservationId } : undefined,
                status: {
                    notIn: [
                        ReservationStatus.CANCELLED,
                        ReservationStatus.EXPIRED
                    ]
                },
                startTime: {
                    lt: new Date(endTime) // less than endTime
                },
                endTime: {
                    gt: new Date(startTime) // greater than startTime
                }
            }
        });


        if (conflict) {
            throw new ConflictException('ROOM_ALREADY_RESERVED');
        }
    }

    async checkExistence(id: string): Promise<boolean> {
        const reservation = await this.prismaService.reservation.findUnique({
            where: { id },
            select: { id: true },
        });

        return !!reservation;
    }
}
