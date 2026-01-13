import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { Role } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: Role.ADMIN },
    create: { email: adminEmail, password: hashedPassword, role: Role.ADMIN },
  });

  console.log(`Usuario admin listo: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });