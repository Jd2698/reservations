import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, RescheduleReservationDto } from './dto';
import { Roles, User, UserPayload } from '@app/common/decorators';
import { RolesGuard } from '../auth/guards';
import { Role } from '@app/common/enums';

@UseGuards(RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Roles(Role.ADMIN)
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

  @Patch(':id/confirm')
  confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.confirm(id, user.sub);
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
