import { Router } from "express";
import { createQueue, getAllQueue, getStatus, nextNumberCalled, skippedNumberStatus } from "../controllers/queueController";

const router = Router();

// POST /auth/login
router.post("/", createQueue);
router.get("/", getAllQueue);
router.post("/next", nextNumberCalled);
router.post("/:id/skip", skippedNumberStatus);
router.get("/:id", getStatus);

export default router;