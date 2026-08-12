import { Request, Response } from "express";
import { takeQueue } from "../services/queueService";

export async function createQueue(req: Request, res: Response) {
  try {
    const result = await takeQueue();
    return res.status(201).json({ message: "Antrian berhasil dibuat", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal Menambahkan";
    return res.status(400).json({ message });
  }
}