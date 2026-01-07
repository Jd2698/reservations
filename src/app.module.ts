import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [UsersModule, PrismaModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
