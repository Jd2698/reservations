import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateResrvationDto } from './dto';
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

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateResrvationDto,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.update(id, updateReservationDto, user.sub);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.delete(id);
  }
}
