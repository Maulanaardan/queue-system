import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function login(username: string, password: string) {
  // 1. cari user berdasarkan username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  // 2. kalau gak ada
  if (!user) {
    throw new Error("Username atau password salah");
  }

  // 3. cek password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Username atau password salah");
  }

  // 4. generate token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return { token };
}