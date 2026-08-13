import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
// @ts-ignore: bcryptjs has no bundled type declarations in this project
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "doctor.create.test@medilink.test";
  const password = "MediLink123!";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: "Amine",
      lastName: "TestDoctor",
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Doctor USER created:");
  console.log({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  console.log("IMPORTANT: No Doctor profile was created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
