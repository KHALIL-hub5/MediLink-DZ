import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@medilink.dz' },
    update: {},
    create: {
      email: 'admin@medilink.dz',
      password: 'changeme',
      role: 'ADMIN',
    },
  });
}
main()
  .catch(console.error)
  .finally(() => prisma.());
