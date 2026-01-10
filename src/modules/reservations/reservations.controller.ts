import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, RescheduleReservationDto } from './dto';
import { User, UserPayload } from '@app/common/decorators';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @User() user: UserPayload) {
    return this.reservationsService.create(createReservationDto, user.sub);
  }

  @Patch(':id/reschedule')
  reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: RescheduleReservationDto,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.reschedule(id, updateReservationDto, user.sub);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.cancel(id, user.sub);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.delete(id);
  }
}
