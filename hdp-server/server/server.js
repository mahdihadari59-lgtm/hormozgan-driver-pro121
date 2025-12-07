import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./src/routes/auth.js";
import driverRoutes from "./src/routes/driver.js";
import tripRoutes from "./src/routes/trip.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
app.use("/trip", tripRoutes);

app.listen(process.env.PORT, () => {
  console.log("🚀 HDP API Running on Port", process.env.PORT);
});
