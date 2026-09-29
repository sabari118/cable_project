import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const channels = [
    { name: "SPORTS", amount: "100", logo_path: "/channels/sports.svg" },
    { name: "MOVIES", amount: "150", logo_path: "/channels/movies.svg" },
    { name: "KIDS", amount: "80", logo_path: "/channels/kids.svg" },
    { name: "NEWS", amount: "50", logo_path: "/channels/news.svg" },
    { name: "MUSIC", amount: "70", logo_path: "/channels/music.svg" },
    { name: "SPORTS_HD", amount: "200", logo_path: "/channels/sports_hd.svg" },
    { name: "MOVIES_HD", amount: "220", logo_path: "/channels/movies_hd.svg" },
    { name: "DOCUMENTARY", amount: "90", logo_path: "/channels/documentary.svg" },
  ];

  for (const channel of channels) {
    await prisma.channel.upsert({
      where: { name: channel.name },
      update: { logo_path: channel.logo_path, amount: channel.amount },
      create: channel,
    });
    console.log(`Upserted ${channel.name}`);
  }

  console.log(" Channels seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });