import { PrismaClient } from "@prisma/client";
// @ts-ignore: bcryptjs has no bundled type declarations in this project
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@medilink.test";
  const newPassword = "Admin123!";

  // Hash the new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update the existing admin user
  const admin = await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordHash,
    },
  });

  console.log("Admin password updated successfully");

  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });