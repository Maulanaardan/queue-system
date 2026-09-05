import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import queueRoutes from "./routes/queueRoute";
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Queue System API" });
});
app.use("/auth", authRoutes);
app.use("/queues", queueRoutes);
app.use((err, req, res, next) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
