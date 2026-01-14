import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/common/enums';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(dto: LoginDto) {

        const user = await this.usersService.findByEmail(dto.email);

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) throw new UnauthorizedException();

        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(dto: LoginDto) {

        await this.usersService.checkEmailAvailability(dto.email);

        const hash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.usersService.create({ ...dto, role: Role.USER, password: hash });

        const payload = { sub: newUser.id, email: newUser.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
