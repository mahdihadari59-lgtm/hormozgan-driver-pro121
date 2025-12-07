	mport express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// ایجاد سفر جدید
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      pickup_location,
      dropoff_location,
      car_type,
      passengers,
      distance,
      duration,
      price,
    } = req.body;

    if (!user_id || !pickup_location || !dropoff_location) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    const result = await db.query(
      `INSERT INTO trips 
      (user_id, pickup_location, dropoff_location, car_type, passengers, distance, duration, price) 
      VALUES (?, POINT(?, ?), POINT(?, ?), ?, ?, ?, ?, ?)`,
      [
        user_id,
        pickup_location.lng,
        pickup_location.lat,
        dropoff_location.lng,
        dropoff_location.lat,
        car_type,
        passengers,
        distance,
        duration,
        price,
      ]
    );

    res.json({
      message: "سفر ایجاد شد",
      tripId: result[0].insertId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// لیست سفرهای کاربر
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM trips WHERE user_id=? ORDER BY id DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "خطا" });
  }
});

// گرفتن سفر فعال
router.get("/active/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM trips WHERE user_id=? AND status IN ('pending','accepted','started') LIMIT 1",
      [userId]
    );

    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: "خطا" });
  }
});

// لغو سفر
router.post("/cancel/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    await db.query("UPDATE trips SET status='cancelled' WHERE id=?", [tripId]);

    res.json({ message: "سفر لغو شد" });
  } catch (err) {
    res.status(500).json({ message: "خطا" });
  }
});

// تایید کامل شدن سفر
router.post("/complete/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    await db.query("UPDATE trips SET status='completed' WHERE id=?", [tripId]);

    res.json({ message: "سفر با موفقیت کامل شد" });
  } catch (err) {
    res.status(500).json({ message: "خطا" });
  }
});

export default router;
