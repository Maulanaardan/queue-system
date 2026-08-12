import { Router } from "express";
import { createQueue } from "../controllers/queueController";

const router = Router();

// POST /auth/login
router.post("/", createQueue);

export default router;