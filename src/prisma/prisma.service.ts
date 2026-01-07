
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma-generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from '@config/envs';

@Injectable()
export class PrismaService extends PrismaClient {

  constructor() {
    const pool = new PrismaPg({ connectionString: envs.databaseUrl! });
    super({ adapter: pool });
  }
}
