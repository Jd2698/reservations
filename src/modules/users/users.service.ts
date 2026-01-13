import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async checkEmailAvailability(email: string): Promise<boolean> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (user) {
            throw new UnauthorizedException('USER_ALREADY_EXISTS');
        }

        return true;
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true
            }
        });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }

    async findAll() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                email: true
            }
        });
    }

    async create(createUserDto: CreateUserDto) {
        return this.prismaService.user.create({
            data: createUserDto
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.prismaService.user.update({
            where: { id },
            data: updateUserDto
        })
    }

    async delete(id: string) {
        const exists = await this.prismaService.user.count({ where: { id } });

        if (exists == 0) throw new NotFoundException('User not found');

        return this.prismaService.user.delete({ where: { id } });
    }
}