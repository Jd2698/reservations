import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt'
import { UserPayload } from '@app/common/decorators';
import { Role } from '@app/generated/prisma/enums';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async checkEmailAvailability(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
            select: { id: true}
        });

        if (user) {
            throw new UnauthorizedException('USER_ALREADY_EXISTS');
        }
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        return user;
    }

    async findAll() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                role: true
            }
        });
    }

    async create(dto: CreateUserDto) {
        await this.checkEmailAvailability(dto.email);

        const hash = await bcrypt.hash(dto.password, 10);

        return this.prismaService.user.create({
            data: { ...dto, password: hash }
        });
    }

    async update(id: string, dto: UpdateUserDto) {

        const newPassword = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

        return this.prismaService.user.update({
            where: { id },
            data: { ...dto, password: newPassword }
        })
    }

    async delete(userId: string, authUser: UserPayload) {

        if(userId != authUser.sub && authUser.role != Role.ADMIN) throw new ForbiddenException('ROLE_NOT_ALLOWED_FOR_ACTION')

        await this.checkExistence(userId);

        return this.prismaService.user.delete({
            where: { id: userId }
        });
    }

    async checkExistence(userId: string) {
        const user = await this.prismaService.user.findFirst({
            where: { id: userId },
            select: { id: true }
        });

        if (!user) throw new NotFoundException('USER_NOT_FOUND');
    }
}