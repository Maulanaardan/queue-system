import { Request, Response } from "express";
import { takeQueue, getQueue, status } from "../services/queueService";

export async function createQueue(req: Request, res: Response) {
  try {
    const result = await takeQueue();
    return res.status(201).json({ message: "Antrian berhasil dibuat", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal Menambahkan";
    return res.status(400).json({ message });
  }
}

export async function getAllQueue(req: Request, res: Response) {
  try {
    const result = await getQueue();
    return res.status(200).json({ message: "Semua nomor antrian", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal Melihat Nomor";
    return res.status(400).json({ message });
  }
}

export async function getStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const result = await status(id);
    return res.status(200).json({ message: "status:", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal Melihat status";
    return res.status(400).json({ message });
  }
}