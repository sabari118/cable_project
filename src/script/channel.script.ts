import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.channel.createMany({
    data: [
      { name: "SPORTS", amount: "100" },
      { name: "MOVIES", amount: "150" },
      { name: "KIDS", amount: "80" },
      { name: "NEWS", amount: "50" },
      { name: "MUSIC", amount: "70" },
      { name: "SPORTS_HD", amount: "200" },
      { name: "MOVIES_HD", amount: "220" },
      { name: "DOCUMENTARY", amount: "90" }
    ],
    skipDuplicates: true // avoids duplicate insert
  });

  console.log("✅ Channels seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });