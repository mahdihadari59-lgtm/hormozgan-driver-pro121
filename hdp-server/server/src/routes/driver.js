import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// ثبت راننده جدید
router.post("/register", async (req, res) => {
  try {
    const { name, phone, car } = req.body;

    if (!name || !phone)
      return res.status(400).json({ message: "اطلاعات ناقص است" });

    const [result] = await db.query(
      "INSERT INTO drivers (name, phone, car) VALUES (?, ?, ?)",
      [name, phone, car || null]
    );

    res.json({ message: "راننده ثبت شد", driverId: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// لیست راننده‌ها
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM drivers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "خطای سرور" });
  }
});

export default router;
