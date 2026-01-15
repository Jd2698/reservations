import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { Public } from '@app/common/decorators/public.decorator';
import { Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Roles(Role.ADMIN)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }


  @Public()
  @Roles()
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }
}
