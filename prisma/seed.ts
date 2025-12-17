import { PrismaClient } from "@prisma/client";
const CATEGORIES = [
  { id: "cat-1", name: "Web3 Development" },
  { id: "cat-2", name: "Legal" },
  { id: "cat-6", name: "Marketing & Growth" },
  { id: "cat-7", name: "Health Experts" },
  { id: "cat-8", name: "Entertainment" },
  { id: "cat-9", name: "Real Estate" },
  { id: "cat-10", name: "Software Engineering" },
];

const prisma = new PrismaClient();

async function main() {
  // Seed System Settings
  const settings = await prisma.systemSettings.findFirst();
  if (!settings) {
    await prisma.systemSettings.create({
      data: {
        platformFeePercentage: 5.0,
      },
    });
    console.log("System settings seeded");
  }

  // Seed Categories
  for (const category of CATEGORIES) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          slug: category.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/&/g, "and"),
        },
      });
    }
  }
  console.log("Categories seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
