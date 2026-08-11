import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allergy = await prisma.allergy.upsert({
    where: {
      name: "Penicillin",
    },
    update: {},
    create: {
      name: "Penicillin",
    },
  });

  console.log("Allergy ready:");
  console.log(allergy);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });