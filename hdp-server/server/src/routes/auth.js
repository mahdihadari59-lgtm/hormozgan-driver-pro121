import express from "express";
import Driver from "../models/Driver.js";
import Wallet from "../models/Wallet.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ثبت‌نام راننده
router.post("/register", auth, async (req, res) => {
  try {
    const driverId = await Driver.register({
      user_id: req.user.id,
      ...req.body,
    });

    await Wallet.createWallet(driverId);

    res.json({ message: "ثبت‌نام راننده با موفقیت انجام شد", driverId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ثبت‌نام" });
  }
});

// آپدیت موقعیت راننده
router.post("/update-location", auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    await Driver.updateLocation(req.user.id, lat, lng);

    res.json({ message: "موقعیت به‌روزرسانی شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در آپدیت موقعیت" });
  }
});

export default router;
