import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import tripRoutes from "./src/routes/trip.js";
import driverRoutes from "./src/routes/driver.js";
import { db } from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/trip", tripRoutes);
app.use("/driver", driverRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 HDP Backend running on port ${PORT}`);
});
