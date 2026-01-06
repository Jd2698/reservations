import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    test() {
        return this.prismaService.$queryRaw`SELECT 2+2 AS result`;
    }
}
