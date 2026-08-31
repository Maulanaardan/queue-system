import { Router } from "express";
import { createQueue, getAllQueue, getStatus } from "../controllers/queueController";

const router = Router();

// POST /auth/login
router.post("/", createQueue);
router.get("/", getAllQueue);
router.get("/:id", getStatus);

export default router;