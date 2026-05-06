import { PrismaClient } from '@prisma/client';
import { Roles_Enum } from '../util/common.enum';

const prisma = new PrismaClient();

const USER_PERMISSION = "USER_PERMISSION";
const OPERATER_PERMISSION = "OPERATER_PERMISSION";

async function main() {
  console.log("🚀 Seeding roles & permissions...");

  // ✅ Create permissions
  const userPermission = await prisma.permission.upsert({
    where: { identifier: USER_PERMISSION },
    update: {},
    create: {
      identifier: USER_PERMISSION,
      description: "Permission for normal users",
    },
  });

  const operaterPermission = await prisma.permission.upsert({
    where: { identifier: OPERATER_PERMISSION },
    update: {},
    create: {
      identifier: OPERATER_PERMISSION,
      description: "Permission for operater",
    },
  });

  // ✅ Create USER role + connect permission
  await prisma.role.upsert({
    where: { role_name: Roles_Enum.ROLE_USER },
    update: {
      permission: {
        set: [{ identifier: userPermission.identifier }],
      },
    },
    create: {
      role_name: Roles_Enum.ROLE_USER,
      permission: {
        connect: [{ identifier: userPermission.identifier }],
      },
    },
  });

  // ✅ Create OPERATER role + connect permission
  await prisma.role.upsert({
    where: { role_name: Roles_Enum.ROLE_OPERATER },
    update: {
      permission: {
        set: [{ identifier: operaterPermission.identifier }],
      },
    },
    create: {
      role_name: Roles_Enum.ROLE_OPERATER,
      permission: {
        connect: [{ identifier: operaterPermission.identifier }],
      },
    },
  });

  console.log("✅ Roles & Permissions seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });