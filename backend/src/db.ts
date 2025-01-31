import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1);
  }
}
process.on("SIGINT", async () => {
  console.log("Closing Prisma connection...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing Prisma connection...");
  await prisma.$disconnect();
  process.exit(0);
});
