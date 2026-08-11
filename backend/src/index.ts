import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/authRoute";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Queue System API" });
});

app.use("/auth", authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});