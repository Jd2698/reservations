import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto';
import { User, UserPayload } from '@app/common/decorators';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto, @User() user: UserPayload) {
    return this.reservationsService.create(createReservationDto, user.sub);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.cancel(id, user.sub);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.delete(id);
  }
}
