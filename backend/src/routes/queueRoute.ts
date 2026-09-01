import { Router } from "express";
import { createQueue, getAllQueue, getStatus, nextNumberCalled, skippedNumberStatus, resetAll } from "../controllers/queueController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

// POST /auth/login
router.post("/", createQueue);
router.get("/", authMiddleware, getAllQueue);
router.post("/next", authMiddleware, nextNumberCalled);
router.post("/reset", authMiddleware, resetAll);
router.post("/:id/skip", authMiddleware, skippedNumberStatus);
router.get("/:id", getStatus);

export default router;