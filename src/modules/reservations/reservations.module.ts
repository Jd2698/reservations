import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ReservationTasksService } from './reservation-tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationTasksService],
})
export class ReservationsModule {}
