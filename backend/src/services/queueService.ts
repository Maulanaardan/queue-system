import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

//tambah antrian
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

//lihat antrian
export async function getQueue() {
  const allNumber = await prisma.queue.findMany()
  return allNumber
}

//lihat status nomor tertentu
export async function status(id: number) {
  const statusNumber = await prisma.queue.findUnique({ where: { id } })
  return statusNumber
}

//next antrian
export async function  nextNumber() {
  const  calledNumber = await prisma.queue.findFirst({
    where: {queue_status :"waiting"},
    orderBy: {queue_number: "asc"}
  })

  if (!calledNumber) {
    throw new Error("Tidak ada antrian yang menunggu");
  }
    
  const updateNumber = await prisma.queue.update({
    where: { id: calledNumber.id },
    data : {
      queue_status: "called", called_at: new Date() 
    }
  })
  return updateNumber;
}

export async function skippedNumber(id: number) {
  const updateStatus  = await prisma.queue.update({
    where : {id},
    data : {
      queue_status : "skipped"
    }
  })
  return updateStatus
}

export async function reset() {
  const clearData = await prisma.queue.deleteMany()
  return clearData
}
