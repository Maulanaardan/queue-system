import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function takeQueue() {
  // 1. ambil nomor antrian terakhir
  const last = await prisma.queue.findFirst({
    orderBy: { queue_number: "desc" }
  });

  // 2. hitung nomor baru
  const newNumber = last ? last.queue_number + 1 : 1;

  // 3. simpen ke database
  const queue = await prisma.queue.create({
    data: {
      queue_number: newNumber,
      queue_status: "waiting"
    }
  });

  return queue;
}