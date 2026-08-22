import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "14042003Mm"; // 👈 set your real password here
  const hash = await bcrypt.hash(plainPassword, 10); // 👈 10 = salt rounds

  await prisma.user.create({
    data: {
      email: "admin@medilinkdz.com",
      passwordHash: hash,
      firstName: "MediLink",
      lastName: "Admin",
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
