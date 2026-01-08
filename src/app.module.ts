import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  imports: [PrismaModule, UsersModule, RoomsModule, AuthModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AppModule { }
