import { PrismaClient } from "@prisma/client"; // adjust path
import { Roles_Enum } from "../util/common.enum";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding roles...");

  const roles = Object.values(Roles_Enum);

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { role_name: roleName }, // ✅ unique field
      update: {}, // do nothing if exists
      create: {
        role_name: roleName,
      },
    });
  }

  console.log("✅ All roles loaded");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });