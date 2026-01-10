import { ReservationStatus } from '@app/generated/prisma/enums';
import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReservationTasksService {
    private readonly logger = new Logger(ReservationTasksService.name);

    constructor(private readonly prisma: PrismaService) {
        const date = new Date();
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async expireReservations() {
        const now = new Date();

        const result = await this.prisma.reservation.updateMany({
            where: {
                status: {
                    notIn: [ReservationStatus.CANCELLED, ReservationStatus.EXPIRED],
                },
                endTime: {
                    lt: now,
                }
            },
            data: {
                status: ReservationStatus.EXPIRED
            }
        });

        if (result.count > 0) {
            this.logger.log(`Expired ${result.count} reservations`);
        }
    }
}
