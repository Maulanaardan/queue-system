import { Router } from "express";
import { authLogin } from "../controllers/authController";
const router = Router();
// POST /auth/login
router.post("/login", authLogin);
export default router;
