import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const count = await prisma.club.count();
  console.log(`COUNT: ${count}`);
  await prisma.$disconnect();
}

main();
