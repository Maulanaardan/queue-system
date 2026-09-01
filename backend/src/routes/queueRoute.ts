import { Router } from "express";
import { createQueue, getAllQueue, getStatus, nextNumberCalled } from "../controllers/queueController";

const router = Router();

// POST /auth/login
router.post("/", createQueue);
router.get("/", getAllQueue);
router.post("/next", nextNumberCalled);
router.get("/:id", getStatus);

export default router;