import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'secret',
    signOptions: { expiresIn: '60m' },
  })],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule { }
