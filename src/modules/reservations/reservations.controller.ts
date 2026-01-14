import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, RescheduleReservationDto } from './dto';
import { Roles, User, UserPayload } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Roles(Role.STAFF, Role.USER)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @User() user: UserPayload) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Roles(Role.STAFF, Role.USER)
  @Patch(':id/reschedule')
  reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: RescheduleReservationDto,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.reschedule(id, updateReservationDto, user.sub);
  }

  @Roles(Role.STAFF)
  @Patch(':id/confirm')
  confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.confirm(id, user.sub);
  }

  @Roles(Role.STAFF, Role.USER)
  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.cancel(id, user.sub);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.delete(id);
  }
}
